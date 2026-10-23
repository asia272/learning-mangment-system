import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getInstructor } from "@/lib/auth";

export async function POST(req: Request) {
    const user = await getInstructor();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceType } = await req.json().catch(() => ({}));
    if (resourceType !== "image" && resourceType !== "video") {
        return NextResponse.json({ error: "Invalid resource type" }, { status: 400 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = `lms/${resourceType}s`;

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
        signature,
        timestamp,
        folder,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
}