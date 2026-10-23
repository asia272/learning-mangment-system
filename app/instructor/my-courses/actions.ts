"use server";

import { revalidatePath } from "next/cache";
import { requireInstructor } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function setCoursePublished(courseId: string, isPublished: boolean) {
    const user = await requireInstructor();

    const result = await prisma.course.updateMany({
        where: { id: courseId, instructorId: user.id }, // ownership check
        data: { isPublished },
    });

    if (result.count === 0) {
        return { success: false as const, error: "Course not found" };
    }

    revalidatePath("/instructor/my-courses");
    revalidatePath("/courses");
    return { success: true as const };
}