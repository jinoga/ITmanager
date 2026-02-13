const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
let db;
let isPostgres = false;

if (process.env.POSTGRES_URL) {
    // Vercel Postgres
    isPostgres = true;
    const { Pool } = require('pg');
    db = new Pool({
        connectionString: process.env.POSTGRES_URL,
    });
    console.log('Connected to PostgreSQL Database');
} else {
    // Local SQLite
    const sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database('./database.sqlite', (err) => {
        if (err) console.error('Error opening database', err);
        else {
            console.log('Connected to SQLite database.');
            createTables();
        }
    });
}

// Helper functions for DB abstraction
async function runQuery(sql, params = []) {
    if (isPostgres) {
        // Convert ? to $1, $2, etc.
        let i = 1;
        const pgSql = sql.replace(/\?/g, () => `$${i++}`);
        const result = await db.query(pgSql, params);
        // For INSERT, return id (assuming RETURNING id is used or handled)
        if (sql.trim().toUpperCase().startsWith('INSERT')) {
            if (result.rows.length > 0) return { id: result.rows[0].id };
            return { id: null };
        }
        return { changes: result.rowCount };
    } else {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }
}

async function getAll(sql, params = []) {
    if (isPostgres) {
        const result = await db.query(sql, params);
        return result.rows;
    } else {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

// Initial Table Creation (SQLite only usually, call /api/setup for Postgres)
function createTables() {
    // Tables are created manually via /api/setup for Postgres
    if (isPostgres) return;

    db.run(`CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, requester TEXT, dept TEXT, issue TEXT, status TEXT DEFAULT 'Pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS assets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, serial TEXT, user TEXT, status TEXT DEFAULT 'Active')`);
    db.run(`CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, qty INTEGER DEFAULT 0, unit TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS kb (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, category TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS pm_schedule (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, due_date TEXT, status TEXT DEFAULT 'Pending')`);

    // Master Data Tables
    db.run(`CREATE TABLE IF NOT EXISTS master_technicians (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS master_vendors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, contact TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS master_departments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS master_branches (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`);
}

// API to Initialize Tables (Run this once after deployment)
app.get('/api/setup', async (req, res) => {
    try {
        if (isPostgres) {
            await db.query(`CREATE TABLE IF NOT EXISTS tickets (id SERIAL PRIMARY KEY, requester TEXT, dept TEXT, issue TEXT, status TEXT DEFAULT 'Pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            await db.query(`CREATE TABLE IF NOT EXISTS assets (id SERIAL PRIMARY KEY, name TEXT, type TEXT, serial TEXT, "user" TEXT, status TEXT DEFAULT 'Active')`);
            await db.query(`CREATE TABLE IF NOT EXISTS inventory (id SERIAL PRIMARY KEY, name TEXT, qty INTEGER DEFAULT 0, unit TEXT)`);
            await db.query(`CREATE TABLE IF NOT EXISTS kb (id SERIAL PRIMARY KEY, title TEXT, content TEXT, category TEXT)`);
            await db.query(`CREATE TABLE IF NOT EXISTS pm_schedule (id SERIAL PRIMARY KEY, title TEXT, due_date TEXT, status TEXT DEFAULT 'Pending')`);

            // Master Data (Postgres)
            await db.query(`CREATE TABLE IF NOT EXISTS master_technicians (id SERIAL PRIMARY KEY, name TEXT)`);
            await db.query(`CREATE TABLE IF NOT EXISTS master_vendors (id SERIAL PRIMARY KEY, name TEXT, contact TEXT)`);
            await db.query(`CREATE TABLE IF NOT EXISTS master_departments (id SERIAL PRIMARY KEY, name TEXT)`);
            await db.query(`CREATE TABLE IF NOT EXISTS master_branches (id SERIAL PRIMARY KEY, name TEXT)`);

            res.json({ message: "Postgres Tables Created" });
        } else {
            createTables();
            res.json({ message: "SQLite Tables Created" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Routes ---

// Tickets
app.get('/api/tickets', async (req, res) => {
    try {
        const rows = await getAll("SELECT * FROM tickets ORDER BY created_at DESC");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tickets', async (req, res) => {
    const { requester, dept, issue } = req.body;
    try {
        // Postgres needs RETURNING id to get the inserted ID
        const sql = isPostgres
            ? "INSERT INTO tickets (requester, dept, issue) VALUES (?,?,?) RETURNING id"
            : "INSERT INTO tickets (requester, dept, issue) VALUES (?,?,?)";

        const result = await runQuery(sql, [requester, dept, issue]);
        res.json({ message: "success", id: result.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/tickets/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await runQuery("UPDATE tickets SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ message: "success" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/tickets/:id', async (req, res) => {
    try {
        await runQuery("DELETE FROM tickets WHERE id = ?", [req.params.id]);
        res.json({ message: "deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Assets
app.get('/api/assets', async (req, res) => {
    try {
        const rows = await getAll("SELECT * FROM assets ORDER BY id DESC");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/assets', async (req, res) => {
    const { name, type, serial, user } = req.body;
    try {
        const sql = isPostgres
            ? "INSERT INTO assets (name, type, serial, \"user\") VALUES (?,?,?,?) RETURNING id"
            : "INSERT INTO assets (name, type, serial, user) VALUES (?,?,?,?)";
        const result = await runQuery(sql, [name, type, serial, user]);
        res.json({ message: "success", id: result.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/assets/:id', async (req, res) => {
    try {
        await runQuery("DELETE FROM assets WHERE id = ?", [req.params.id]);
        res.json({ message: "deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Inventory
app.get('/api/inventory', async (req, res) => {
    try {
        const rows = await getAll("SELECT * FROM inventory ORDER BY id DESC");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/inventory', async (req, res) => {
    const { name, qty, unit } = req.body;
    try {
        const sql = isPostgres
            ? "INSERT INTO inventory (name, qty, unit) VALUES (?,?,?) RETURNING id"
            : "INSERT INTO inventory (name, qty, unit) VALUES (?,?,?)";
        const result = await runQuery(sql, [name, qty, unit]);
        res.json({ message: "success", id: result.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/inventory/:id', async (req, res) => {
    const { qty } = req.body;
    try {
        await runQuery("UPDATE inventory SET qty = ? WHERE id = ?", [qty, req.params.id]);
        res.json({ message: "updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// KB
app.get('/api/kb', async (req, res) => {
    try {
        const rows = await getAll("SELECT * FROM kb ORDER BY id DESC");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/kb', async (req, res) => {
    const { title, content, category } = req.body;
    try {
        const sql = isPostgres
            ? "INSERT INTO kb (title, content, category) VALUES (?,?,?) RETURNING id"
            : "INSERT INTO kb (title, content, category) VALUES (?,?,?)";
        const result = await runQuery(sql, [title, content, category]);
        res.json({ message: "success", id: result.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PM Schedule
app.get('/api/pm', async (req, res) => {
    try {
        const rows = await getAll("SELECT * FROM pm_schedule ORDER BY due_date ASC");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/pm', async (req, res) => {
    const { title, due_date } = req.body;
    try {
        const sql = isPostgres
            ? "INSERT INTO pm_schedule (title, due_date) VALUES (?,?) RETURNING id"
            : "INSERT INTO pm_schedule (title, due_date) VALUES (?,?)";
        const result = await runQuery(sql, [title, due_date]);
        res.json({ message: "success", id: result.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/pm/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await runQuery("UPDATE pm_schedule SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ message: "updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 5. MASTER DATA API Helpers ---
const masterTables = ['technicians', 'vendors', 'departments', 'branches'];

masterTables.forEach(table => {
    const tableName = `master_${table}`;

    // GET
    app.get(`/api/master/${table}`, async (req, res) => {
        try {
            const rows = await getAll(`SELECT * FROM ${tableName} ORDER BY id DESC`);
            res.json({ data: rows });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    // POST
    app.post(`/api/master/${table}`, async (req, res) => {
        const { name, extra } = req.body; // extra can be contact info, etc.
        try {
            const sql = isPostgres
                ? `INSERT INTO ${tableName} (name${table === 'vendors' ? ', contact' : ''}) VALUES (?${table === 'vendors' ? ',?' : ''}) RETURNING id`
                : `INSERT INTO ${tableName} (name${table === 'vendors' ? ', contact' : ''}) VALUES (?${table === 'vendors' ? ',?' : ''})`;

            const params = table === 'vendors' ? [name, extra] : [name];
            const result = await runQuery(sql, params);
            res.json({ message: "success", id: result.id });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    // DELETE
    app.delete(`/api/master/${table}/:id`, async (req, res) => {
        try {
            await runQuery(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
            res.json({ message: "deleted" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });
});

// Fallback for SPA routing if needed
app.get(/(.*)/, (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
