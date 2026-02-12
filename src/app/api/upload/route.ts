import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // In a real application, you would upload to Vercel Blob, Cloudinary, or S3 here.
        // For local development/demo, we'll simulate a successful upload and return a mock URL.
        console.log("File received:", file.name, file.size, file.type);

        // Mock successful upload return
        // Ideally, you'd convert this to a Data URI or save it to a public folder for local tests
        return NextResponse.json({
            url: "https://placeholder.com/mock-upload-success",
            filename: file.name
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
