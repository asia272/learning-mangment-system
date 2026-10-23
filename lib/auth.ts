import { redirect } from "next/navigation";
import { getCurrentUser } from "./current-user";

// For pages, layouts and server actions: redirects when not allowed.
export async function requireInstructor() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");
    if (user.role !== "INSTRUCTOR") redirect("/");
    return user;
}

// For API routes: returns null instead of redirecting.
export async function getInstructor() {
    const user = await getCurrentUser();
    if (!user || user.role !== "INSTRUCTOR") return null;
    return user;
}