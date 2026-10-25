import { prisma } from "@/lib/prisma";

export async function getMyEnrollments(userId: string) {
    const rows = await prisma.enrollment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            createdAt: true,
            course: {
                select: {
                    id: true,
                    title: true,
                    thumbnailUrl: true,
                    chapters: { select: { lectures: { select: { duration: true } } } },
                    _count: { select: { enrollments: true } }, // total students of this course
                },
            },
        },
    });

    const courseIds = rows.map((r) => r.course.id);
    const done = courseIds.length
        ? await prisma.lectureProgress.findMany({
            where: { userId, lecture: { chapter: { courseId: { in: courseIds } } } },
            select: { lecture: { select: { chapter: { select: { courseId: true } } } } },
        })
        : [];

    const doneByCourse = new Map<string, number>();
    for (const d of done) {
        const id = d.lecture.chapter.courseId;
        doneByCourse.set(id, (doneByCourse.get(id) ?? 0) + 1);
    }

    return rows.map((row) => {
        const lectures = row.course.chapters.flatMap((c) => c.lectures);
        return {
            id: row.id,
            enrolledAt: row.createdAt,
            course: {
                id: row.course.id,
                title: row.course.title,
                thumbnailUrl: row.course.thumbnailUrl,
            },
            totalSeconds: lectures.reduce((sum, l) => sum + l.duration, 0),
            totalLectures: lectures.length,
            completedLectures: doneByCourse.get(row.course.id) ?? 0,
            totalStudents: row.course._count.enrollments,
        };
    });
}

export async function findEnrollmentBySession(userId: string, sessionId: string) {
    return prisma.enrollment.findFirst({
        where: { userId, stripeSessionId: sessionId },
        select: { id: true },
    });
}