"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

type Result = { success: true } | { success: false; error: string };

async function assertEnrolled(userId: string, courseId: string) {
    const e = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: { id: true },
    });
    return Boolean(e);
}

export async function setLectureCompleted(
    lectureId: string,
    completed: boolean
): Promise<Result> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Please sign in." };

    const lecture = await prisma.lecture.findUnique({
        where: { id: lectureId },
        select: { chapter: { select: { courseId: true } } },
    });
    if (!lecture) return { success: false, error: "Lecture not found." };

    const courseId = lecture.chapter.courseId;
    if (!(await assertEnrolled(user.id, courseId))) {
        return { success: false, error: "You are not enrolled in this course." };
    }

    if (completed) {
        await prisma.lectureProgress.upsert({
            where: { userId_lectureId: { userId: user.id, lectureId } },
            update: {},
            create: { userId: user.id, lectureId },
        });
    } else {
        await prisma.lectureProgress.deleteMany({ where: { userId: user.id, lectureId } });
    }

    revalidatePath("/my-enrollments");
    return { success: true };
}

export async function rateCourse(courseId: string, rating: number): Promise<Result> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Please sign in." };

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return { success: false, error: "Rating must be from 1 to 5." };
    }
    if (!(await assertEnrolled(user.id, courseId))) {
        return { success: false, error: "Only enrolled students can rate this course." };
    }

    await prisma.courseReview.upsert({
        where: { userId_courseId: { userId: user.id, courseId } },
        update: { rating },
        create: { userId: user.id, courseId, rating },
    });

    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/courses");
    revalidatePath("/");
    return { success: true };
}