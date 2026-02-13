import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/stats - Dashboard statistics
export async function GET() {
    try {
        const { prisma } = await import("@/lib/prisma");
        const [pending, inProgress, external, completed] = await Promise.all([
            prisma.ticket.count({ where: { status: "รอดำเนินการ" } }),
            prisma.ticket.count({ where: { status: "กำลังซ่อม" } }),
            prisma.ticket.count({ where: { status: "ส่งซ่อมภายนอก" } }),
            prisma.ticket.count({ where: { status: "สำเร็จแล้ว" } }),
        ]);

        return NextResponse.json({
            pending,
            inProgress,
            external,
            completed,
        });
    } catch (error) {
        console.error("GET /api/stats error:", error);
        return NextResponse.json(
            { error: "ไม่สามารถดึงข้อมูลสถิติได้" },
            { status: 500 }
        );
    }
}
