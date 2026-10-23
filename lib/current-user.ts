import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { isInstructorEmail } from "./instructor";
import type { User } from "../generated/prisma/client";

async function getVerifiedClerkEmail() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const primary = clerkUser.primaryEmailAddress ?? clerkUser.emailAddresses[0];
    if (!primary?.emailAddress) return null;

    return {
        clerkUser,
        email: primary.emailAddress.toLowerCase(),
        verified: primary.verification?.status === "verified",
    };
}

export async function getCurrentUser(): Promise<User | null> {
    const { userId } = await auth();
    if (!userId) return null;

    const existing = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (existing) {
        const allowed = isInstructorEmail(existing.email);

        // removed from INSTRUCTOR_EMAILS -> lose access immediately
        if (existing.role === "INSTRUCTOR" && !allowed) {
            return prisma.user.update({
                where: { id: existing.id },
                data: { role: "STUDENT" },
            });
        }

        // added to INSTRUCTOR_EMAILS later -> promote, but only if Clerk verified the email
        if (existing.role === "STUDENT" && allowed) {
            const info = await getVerifiedClerkEmail();
            if (info?.verified && info.email === existing.email.toLowerCase()) {
                return prisma.user.update({
                    where: { id: existing.id },
                    data: { role: "INSTRUCTOR" },
                });
            }
        }

        return existing;
    }

    // first visit of this Clerk account
    const info = await getVerifiedClerkEmail();
    if (!info) return null;

    const { clerkUser, email, verified } = info;
    const role = verified && isInstructorEmail(email) ? "INSTRUCTOR" : "STUDENT";
    const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

    // a row with this email may already exist (old test account) -> link it
    const byEmail = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
    });
    if (byEmail) {
        if (!verified) return null; // never link an unverified email
        return prisma.user.update({
            where: { id: byEmail.id },
            data: { clerkId: userId, imageUrl: clerkUser.imageUrl, name: name ?? byEmail.name, role },
        });
    }

    try {
        return await prisma.user.create({
            data: { clerkId: userId, email, name, imageUrl: clerkUser.imageUrl, role },
        });
    } catch {
        // two requests created it at the same moment
        return prisma.user.findUnique({ where: { clerkId: userId } });
    }
}