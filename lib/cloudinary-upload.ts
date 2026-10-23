export type UploadResult = {
    url: string;
    publicId: string;
    duration?: number; // seconds, only for videos
};

export async function uploadToCloudinary(
    file: File,
    resourceType: "image" | "video"
): Promise<UploadResult> {
    const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceType }),
    });
    if (!signRes.ok) throw new Error("Could not get upload permission");

    const { signature, timestamp, folder, apiKey, cloudName } = await signRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: form }
    );
    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return {
        url: data.secure_url,
        publicId: data.public_id,
        duration: data.duration ? Math.round(data.duration) : undefined,
    };
}