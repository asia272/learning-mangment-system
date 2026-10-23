export function isInstructorEmail(email: string) {
    const allowed = (process.env.INSTRUCTOR_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    return allowed.includes(email.trim().toLowerCase());
}