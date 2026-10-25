import { prisma } from "../prisma";

export async function getAdminStats() {
    const [totalUsers, instructors, courses, publishedCourses, enrollments, revenue, pending] =
        await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "INSTRUCTOR" } }),
            prisma.course.count(),
            prisma.course.count({ where: { isPublished: true } }),
            prisma.enrollment.count(),
            prisma.enrollment.aggregate({ _sum: { amountPaid: true } }),
            prisma.instructorApplication.count({ where: { status: "PENDING" } }),
        ]);

    return {
        totalUsers,
        instructors,
        students: totalUsers - instructors,
        courses,
        publishedCourses,
        enrollments,
        revenue: revenue._sum.amountPaid ?? 0, // cents
        pending,
    };
}

export function getRecentEnrollments(take = 6) {
    return prisma.enrollment.findMany({
        take,
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            course: { select: { title: true } },
        },
    });
}