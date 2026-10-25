"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

type Result = { success: true } | { success: false; error: string };

async function assertAdmin() {
    const user = await getCurrentUser();
    if (!user?.isAdmin) throw new Error("Forbidden");
    return user;
}

export async function reviewApplication(
    id: string,
    decision: "APPROVED" | "REJECTED",
    note?: string
): Promise<Result> {
    await assertAdmin();

    const application = await prisma.instructorApplication.findUnique({ where: { id } });
    if (!application || application.status !== "PENDING") {
        return { success: false, error: "This application was already reviewed." };
    }

    await prisma.$transaction(async (tx) => {
        await tx.instructorApplication.update({
            where: { id },
            data: { status: decision, reviewNote: note?.trim() || null, reviewedAt: new Date() },
        });
        if (decision === "APPROVED") {
            await tx.user.update({ where: { id: application.userId }, data: { role: "INSTRUCTOR" } });
        }
    });

    revalidatePath("/admin", "layout");
    return { success: true };
}

export async function revokeInstructor(userId: string): Promise<Result> {
    const admin = await assertAdmin();
    if (admin.id === userId) return { success: false, error: "You can't revoke your own access." };

    await prisma.user.update({ where: { id: userId }, data: { role: "STUDENT" } });

    revalidatePath("/admin", "layout");
    return { success: true };
}

export async function setCoursePublishedByAdmin(
    courseId: string,
    isPublished: boolean
): Promise<Result> {
    await assertAdmin();

    await prisma.course.update({ where: { id: courseId }, data: { isPublished } });

    revalidatePath("/admin", "layout");
    revalidatePath("/courses");
    return { success: true };
}