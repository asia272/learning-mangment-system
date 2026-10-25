import { prisma } from "@/lib/prisma";

export async function getPlayerData(userId: string, courseId: string) {
    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: { id: true },
    });
    if (!enrollment) return null; // not enrolled: no video URLs are loaded at all

    const [course, progress, review] = await Promise.all([
        prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                chapters: {
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        title: true,
                        lectures: {
                            orderBy: { order: "asc" },
                            select: { id: true, title: true, duration: true, videoUrl: true },
                        },
                    },
                },
            },
        }),
        prisma.lectureProgress.findMany({
            where: { userId, lecture: { chapter: { courseId } } },
            select: { lectureId: true },
        }),
        prisma.courseReview.findUnique({
            where: { userId_courseId: { userId, courseId } },
            select: { rating: true },
        }),
    ]);
    if (!course) return null;

    return {
        course,
        completedIds: progress.map((p) => p.lectureId),
        myRating: review?.rating ?? 0,
    };
}