import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Lazy load prisma to prevent build-time connection
async function getPrisma() {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
}

// Generate Job ID like JOB2025-0001
async function generateJobId(): Promise<string> {
    const prisma = await getPrisma();
    const year = new Date().getFullYear();
    const prefix = `JOB${year}-`;

    const lastTicket = await prisma.ticket.findFirst({
        where: { jobId: { startsWith: prefix } },
        orderBy: { jobId: "desc" },
    });

    let nextNumber = 1;
    if (lastTicket) {
        const lastNumber = parseInt(lastTicket.jobId.replace(prefix, ""), 10);
        nextNumber = lastNumber + 1;
    }

    return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

// GET /api/tickets - List all tickets
export async function GET(request: NextRequest) {
    try {
        const prisma = await getPrisma();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { jobId: { contains: search, mode: "insensitive" } },
                { requester: { contains: search, mode: "insensitive" } },
                { assetName: { contains: search, mode: "insensitive" } },
            ];
        }

        if (status) {
            where.status = status;
        }

        const tickets = await prisma.ticket.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(tickets);
    } catch (error) {
        console.error("GET /api/tickets error:", error);
        return NextResponse.json(
            { error: "ไม่สามารถดึงข้อมูลได้" },
            { status: 500 }
        );
    }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
    try {
        const prisma = await getPrisma();
        const body = await request.json();
        const { requester, branch, dept, assetType, assetName, issue } = body;

        if (!requester || !branch || !dept || !assetType || !issue) {
            return NextResponse.json(
                { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        const jobId = await generateJobId();

        const ticket = await prisma.ticket.create({
            data: {
                jobId,
                requester,
                branch,
                dept,
                assetType,
                assetName: assetName || assetType,
                issue,
            },
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error("POST /api/tickets error:", error);
        return NextResponse.json(
            { error: "ไม่สามารถบันทึกข้อมูลได้" },
            { status: 500 }
        );
    }
}
