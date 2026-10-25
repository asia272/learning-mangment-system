export function isAdminEmail(email: string) {
    const allowed = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    return allowed.includes(email.trim().toLowerCase());
}