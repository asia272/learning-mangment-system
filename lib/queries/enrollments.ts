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