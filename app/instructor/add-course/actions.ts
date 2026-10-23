"use server";

import { revalidatePath } from "next/cache";
import { requireInstructor } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseSchema, type CourseInput } from "@/lib/validations/course";

export async function createCourse(input: CourseInput) {
    const user = await requireInstructor();

    const parsed = courseSchema.safeParse(input);
    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues[0]?.message ?? "Invalid data",
        };
    }
    const data = parsed.data;

    // one nested create = one database transaction (all rows saved, or none)
    const course = await prisma.course.create({
        data: {
            title: data.title,
            description: data.description,
            price: data.price,
            discountPercent: data.discountPercent,
            thumbnailUrl: data.thumbnailUrl,
            thumbnailPublicId: data.thumbnailPublicId,
            instructorId: user.id,
            chapters: {

                create: data.chapters.map((chapter, ci) => ({
                    title: chapter.title,
                    order: ci + 1,
                    lectures: {
                        create: chapter.lectures.map((lecture, li) => ({
                            ...lecture,
                            order: li + 1,
                        })),
                    },
                })),
            },
        },
    });

    revalidatePath("/instructor");
    return { success: true as const, courseId: course.id };
}