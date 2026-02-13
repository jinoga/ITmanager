import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/master-data?type=branch
export async function GET(request: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const all = searchParams.get("all") === "true"; // If true, include inactive

        const where: Record<string, unknown> = {};
        if (!all) where.isActive = true;
        if (type) where.type = type;

        const data = await prisma.masterData.findMany({
            where,
            orderBy: [{ type: "asc" }, { value: "asc" }],
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

// POST /api/master-data - Create new entry
export async function POST(request: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const { type, value } = await request.json();

        if (!type || !value) {
            return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
        }

        const data = await prisma.masterData.create({
            data: { type, value },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "ไม่สามารถเพิ่มข้อมูลได้" }, { status: 500 });
    }
}

// PATCH /api/master-data/:id (using body for ID if not in URL)
export async function PATCH(request: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const body = await request.json();
        const { id, value, isActive } = body;

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const data = await prisma.masterData.update({
            where: { id },
            data: { value, isActive },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "ไม่สามารถแก้ไขข้อมูลได้" }, { status: 500 });
    }
}

// DELETE /api/master-data (using query param)
export async function DELETE(request: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await prisma.masterData.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "ไม่สามารถลบข้อมูลได้" }, { status: 500 });
    }
}
