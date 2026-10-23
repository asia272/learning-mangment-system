import { prisma } from "@/lib/prisma";

export async function getDashboardData(instructorId: string) {
    const ownCourses = { course: { instructorId } };

    const [totalCourses, totalEnrolments, earnings, latest] = await Promise.all([
        prisma.course.count({ where: { instructorId } }),
        prisma.enrollment.count({ where: ownCourses }),
        prisma.enrollment.aggregate({
            where: ownCourses,
            _sum: { amountPaid: true },
        }),
        prisma.enrollment.findMany({
            where: ownCourses,
            orderBy: { createdAt: "desc" },
            take: 7,
            select: {
                id: true,
                createdAt: true,
                user: { select: { name: true, email: true, imageUrl: true } },
                course: { select: { title: true } },
            },
        }),
    ]);

    return {
        totalCourses,
        totalEnrolments,
        totalEarnings: earnings._sum.amountPaid ?? 0,
        latest,
    };
}

export async function getInstructorCourses(instructorId: string) {
    const courses = await prisma.course.findMany({
        where: { instructorId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            isPublished: true,
            _count: { select: { enrollments: true } },
        },
    });

    const earnings = await prisma.enrollment.groupBy({
        by: ["courseId"],
        where: { courseId: { in: courses.map((c) => c.id) } },
        _sum: { amountPaid: true },
    });
    const earningsByCourse = new Map(
        earnings.map((e) => [e.courseId, e._sum.amountPaid ?? 0])
    );

    return courses.map((c) => ({
        id: c.id,
        title: c.title,
        thumbnailUrl: c.thumbnailUrl,
        isPublished: c.isPublished,
        students: c._count.enrollments,
        earnings: earningsByCourse.get(c.id) ?? 0,
    }));
}

export async function getInstructorEnrolments(instructorId: string) {
    return prisma.enrollment.findMany({
        where: { course: { instructorId } },
        orderBy: { createdAt: "desc" },
        take: 100, // add pagination later if you need more
        select: {
            id: true,
            createdAt: true,
            user: { select: { name: true, email: true, imageUrl: true } },
            course: { select: { title: true } },
        },
    });
}