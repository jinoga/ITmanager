import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PATCH /api/tickets/[id] - Update a ticket
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const { id } = await params;
        const body = await request.json();

        const ticket = await prisma.ticket.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("PATCH /api/tickets/[id] error:", error);
        return NextResponse.json(
            { error: "ไม่สามารถอัปเดตข้อมูลได้" },
            { status: 500 }
        );
    }
}

// GET /api/tickets/[id] - Get a single ticket
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const { id } = await params;
        const ticket = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!ticket) {
            return NextResponse.json(
                { error: "ไม่พบข้อมูล" },
                { status: 404 }
            );
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("GET /api/tickets/[id] error:", error);
        return NextResponse.json(
            { error: "ไม่สามารถดึงข้อมูลได้" },
            { status: 500 }
        );
    }
}
