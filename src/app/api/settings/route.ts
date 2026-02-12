import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/settings - Retrieve all system settings
export async function GET() {
    try {
        const { prisma } = await import("@/lib/prisma");
        const configs = await prisma.systemConfig.findMany();

        // Convert to key-value object
        const settings = configs.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
    }
}

// POST /api/settings - Update or create system settings
export async function POST(request: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma");
        const body = await request.json();
        const { settings } = body; // Expects { key: value, ... }

        if (!settings || typeof settings !== "object") {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const updates = Object.entries(settings).map(([key, value]) => {
            return prisma.systemConfig.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/settings error:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
