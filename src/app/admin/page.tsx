"use client";

import { useState, useEffect, useCallback } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    BarChart3,
    Database,
    Settings,
    Search,
    X,
    Loader2,
    Home,
    Download,
    Printer,
    LogOut,
} from "lucide-react";
import Link from "next/link";

type Ticket = {
    id: string;
    jobId: string;
    createdAt: string;
    requester: string;
    branch: string;
    dept: string;
    assetType: string;
    assetName: string;
    issue: string;
    status: string;
    tech?: string;
    shop?: string;
    result?: string;
    cost?: number;
    note?: string;
};

type Stats = {
    pending: number;
    inProgress: number;
    external: number;
    completed: number;
};

const STATUS_OPTIONS = [
    "รอดำเนินการ",
    "กำลังซ่อม",
    "ส่งซ่อมภายนอก",
    "สำเร็จแล้ว",
    "ซ่อมไม่ได้",
];

const STATUS_COLORS: Record<string, string> = {
    "รอดำเนินการ": "bg-amber-100 text-amber-700 ring-amber-200",
    "กำลังซ่อม": "bg-blue-100 text-blue-700 ring-blue-200",
    "ส่งซ่อมภายนอก": "bg-purple-100 text-purple-700 ring-purple-200",
    "สำเร็จแล้ว": "bg-emerald-100 text-emerald-700 ring-emerald-200",
    "ซ่อมไม่ได้": "bg-red-100 text-red-700 ring-red-200",
};

export default function AdminDashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<Stats>({ pending: 0, inProgress: 0, external: 0, completed: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [editForm, setEditForm] = useState({
        status: "",
        tech: "",
        shop: "",
        result: "",
        cost: 0,
        note: "",
    });
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const searchParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
            const [ticketsRes, statsRes] = await Promise.all([
                fetch(`/api/tickets${searchParam}`),
                fetch("/api/stats"),
            ]);
            const ticketsData = await ticketsRes.json();
            const statsData = await statsRes.json();

            setTickets(Array.isArray(ticketsData) ? ticketsData : []);
            if (statsData && !statsData.error) setStats(statsData);
        } catch {
            // Keep empty state
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadData();
    };

    const openEdit = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setEditForm({
            status: ticket.status,
            tech: ticket.tech || "",
            shop: ticket.shop || "",
            result: ticket.result || "",
            cost: ticket.cost || 0,
            note: ticket.note || "",
        });
    };

    const handleUpdate = async () => {
        if (!selectedTicket) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                setSelectedTicket(null);
                loadData();
            }
        } catch {
            // Handle error
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        window.location.href = "/admin/login";
    };

    const exportToCSV = () => {
        if (tickets.length === 0) return;

        const headers = ["Job ID", "Requester", "Branch", "Dept", "Asset", "Issue", "Status", "Tech", "Cost", "Date"];
        const rows = tickets.map(t => [
            t.jobId,
            t.requester,
            t.branch,
            t.dept,
            t.assetName,
            t.issue.replace(/,/g, " "),
            t.status,
            t.tech || "",
            t.cost || 0,
            formatDate(t.createdAt)
        ]);

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `it-tickets-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <LayoutDashboard className="text-white w-5 h-5" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">IT Admin</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <a href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-semibold border-r-4 border-blue-600 transition-all">
                        <ClipboardList className="w-5 h-5" />
                        รายการงานซ่อม
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
                        <BarChart3 className="w-5 h-5" />
                        รายงานสถิติ
                    </a>
                    <Link href="/admin/master-data" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
                        <Database className="w-5 h-5" />
                        จัดการ Master Data
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
                        <Settings className="w-5 h-5" />
                        ตั้งค่าระบบ
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <a href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
                        <Home className="w-5 h-5" />
                        กลับหน้าแจ้งซ่อม
                    </a>
                </div>

                <div className="p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">A</div>
                        <div className="text-sm flex-1">
                            <p className="text-white font-semibold">Admin User</p>
                            <p className="text-xs text-slate-500">IT Specialist</p>
                        </div>
                        <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 p-2 transition-colors cursor-pointer">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">รายการงานซ่อม</h1>
                        <p className="text-slate-500">จัดการและติดตามสถานะงานซ่อมทั้งหมดในระบบ</p>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ค้นหา Job ID, ชื่อผู้แจ้ง..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 cursor-pointer"
                        >
                            ค้นหา
                        </button>
                        <button
                            onClick={exportToCSV}
                            type="button"
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-700 cursor-pointer flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Excel
                        </button>
                    </form>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-amber-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">รอดำเนินการ</p>
                        <p className="text-3xl font-black text-slate-900">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-blue-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">กำลังซ่อม</p>
                        <p className="text-3xl font-black text-slate-900">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-purple-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">ส่งซ่อมภายนอก</p>
                        <p className="text-3xl font-black text-slate-900">{stats.external}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">สำเร็จแล้ว</p>
                        <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && tickets.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
                        <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 text-lg font-semibold">ยังไม่มีรายการงานซ่อม</p>
                        <p className="text-slate-400 mt-1">เมื่อมีผู้ใช้แจ้งซ่อม รายการจะปรากฏที่นี่</p>
                    </div>
                )}

                {/* Table Container */}
                {!loading && tickets.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้แจ้ง / สาขา</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">อุปกรณ์ / อาการ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">วันที่</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{ticket.jobId}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{ticket.requester}</p>
                                            <p className="text-sm text-slate-500">{ticket.branch}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="font-bold text-slate-900 truncate max-w-xs">{ticket.assetName}</p>
                                            <p className="text-sm text-slate-500 truncate max-w-xs">{ticket.issue}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ring-1 ${STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-700 ring-gray-200"}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
                                            {formatDate(ticket.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openEdit(ticket)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50 font-semibold text-sm cursor-pointer"
                                            >
                                                จัดการ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">{selectedTicket.jobId}</h2>
                                <p className="text-slate-500 text-sm">{selectedTicket.requester} — {selectedTicket.branch}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                                    title="พิมพ์ใบงาน"
                                >
                                    <Printer className="w-6 h-6" />
                                </button>
                                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm font-semibold text-slate-500 mb-1">อุปกรณ์</p>
                            <p className="font-bold text-slate-900">{selectedTicket.assetName}</p>
                            <p className="text-sm font-semibold text-slate-500 mt-3 mb-1">อาการ</p>
                            <p className="text-slate-700">{selectedTicket.issue}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">สถานะ</label>
                                <select
                                    value={editForm.status}
                                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {STATUS_OPTIONS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">ช่างผู้รับผิดชอบ</label>
                                <input
                                    type="text"
                                    value={editForm.tech}
                                    onChange={e => setEditForm(f => ({ ...f, tech: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ระบุชื่อช่าง"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">ร้านซ่อม (ถ้าส่งซ่อมภายนอก)</label>
                                <input
                                    type="text"
                                    value={editForm.shop}
                                    onChange={e => setEditForm(f => ({ ...f, shop: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ระบุร้านซ่อม"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">ผลการซ่อม</label>
                                <textarea
                                    rows={3}
                                    value={editForm.result}
                                    onChange={e => setEditForm(f => ({ ...f, result: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ระบุผลการซ่อม..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">ค่าใช้จ่าย (บาท)</label>
                                <input
                                    type="number"
                                    value={editForm.cost}
                                    onChange={e => setEditForm(f => ({ ...f, cost: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">หมายเหตุเพิ่มเติม</label>
                                <textarea
                                    rows={2}
                                    value={editForm.note}
                                    onChange={e => setEditForm(f => ({ ...f, note: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="หมายเหตุ..."
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        กำลังบันทึก...
                                    </>
                                ) : (
                                    "บันทึกการแก้ไข"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
