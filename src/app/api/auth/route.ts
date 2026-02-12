import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (password === adminPassword) {
            const response = NextResponse.json({ success: true });

            // Set a secure cookie for authentication
            response.cookies.set("admin_session", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return response;
        }

        return NextResponse.json(
            { error: "รหัสผ่านไม่ถูกต้อง" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
    return response;
}
