import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

// Only allow internal paths, so this can't be used as an open redirect.
function safePath(path?: string) {
    if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
    return path;
}

export default async function AfterAuthPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const { next } = await searchParams;

    if (user.role === "INSTRUCTOR") redirect("/instructor");
    redirect(safePath(next) ?? "/");
}