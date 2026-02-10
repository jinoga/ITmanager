import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Seed Branches
    const branches = [
        "สำนักงานที่ดินจังหวัด",
        "สาขาบางละมุง",
        "สาขาศรีราชา",
    ];

    // Seed Departments
    const departments = [
        "ฝ่ายทะเบียน",
        "ฝ่ายรังวัด",
        "ฝ่ายจัดการ",
        "ฝ่ายอำนวยการ",
        "ฝ่ายเทคโนโลยีสารสนเทศ",
    ];

    // Seed Asset Types
    const assetTypes = [
        "Computer / Laptop",
        "Printer / Scanner",
        "Network / Wi-Fi",
        "Software / OS",
        "อุปกรณ์อื่นๆ",
    ];

    for (const value of branches) {
        await prisma.masterData.upsert({
            where: { id: `branch-${value}` },
            update: { value },
            create: { id: `branch-${value}`, type: "branch", value },
        });
    }

    for (const value of departments) {
        await prisma.masterData.upsert({
            where: { id: `dept-${value}` },
            update: { value },
            create: { id: `dept-${value}`, type: "dept", value },
        });
    }

    for (const value of assetTypes) {
        await prisma.masterData.upsert({
            where: { id: `asset-${value}` },
            update: { value },
            create: { id: `asset-${value}`, type: "asset", value },
        });
    }

    console.log("✅ Seed completed successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
