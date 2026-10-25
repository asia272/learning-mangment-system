"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { applicationSchema } from "@/lib/validations/instructor-application";

type Result = { success: true } | { success: false; error: string };

export async function applyForInstructor(input: unknown): Promise<Result> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Please sign in first." };
    if (user.role === "INSTRUCTOR") return { success: false, error: "You are already an instructor." };

    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
    }

    const pending = await prisma.instructorApplication.findFirst({
        where: { userId: user.id, status: "PENDING" },
    });
    if (pending) return { success: false, error: "You already have an application under review." };

    await prisma.instructorApplication.create({
        data: { userId: user.id, ...parsed.data },
    });

    revalidatePath("/become-instructor");
    revalidatePath("/admin");
    return { success: true };
}