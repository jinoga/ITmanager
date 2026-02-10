import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/master-data?type=branch
export async function GET(request: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        const where: Record<string, unknown> = { isActive: true };
        if (type) where.type = type;

        const data = await prisma.masterData.findMany({
            where,
            orderBy: { value: "asc" },
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/master-data error:", error);
        return NextResponse.json(
            { error: "ไม่สามารถดึงข้อมูลได้" },
            { status: 500 }
        );
    }
}
