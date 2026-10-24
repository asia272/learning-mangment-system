import { prisma } from "@/lib/prisma";

async function ratingsFor(courseIds: string[]) {
    const map = new Map<string, { avg: number; count: number }>();
    if (courseIds.length === 0) return map;

    const rows = await prisma.courseReview.groupBy({
        by: ["courseId"],
        where: { courseId: { in: courseIds } },
        _avg: { rating: true },
        _count: { _all: true },
    });
    for (const r of rows) {
        map.set(r.courseId, { avg: r._avg.rating ?? 0, count: r._count._all });
    }
    return map;
}

export async function getPublishedCourses({ q, limit }: { q?: string; limit: number }) {
    const term = q?.trim();

    const rows = await prisma.course.findMany({
        where: {
            isPublished: true,
            ...(term
                ? {
                    OR: [
                        { title: { contains: term, mode: "insensitive" as const } },
                        { instructor: { name: { contains: term, mode: "insensitive" as const } } },
                    ],
                }
                : {}),
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1, // one extra row tells us whether "Load more" is needed
        select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            price: true,
            discountPercent: true,
            discountEndsAt: true,
            instructor: { select: { name: true } },
        },
    });

    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit);
    const ratings = await ratingsFor(page.map((c) => c.id));

    return {
        hasMore,
        courses: page.map((c) => ({
            ...c,
            rating: ratings.get(c.id)?.avg ?? 0,
            ratingCount: ratings.get(c.id)?.count ?? 0,
        })),
    };
}

export async function getCourseDetail(courseId: string, viewer: { id: string } | null) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            instructor: { select: { name: true } },
            chapters: {
                orderBy: { order: "asc" },
                include: {
                    lectures: {
                        orderBy: { order: "asc" },
                        select: { id: true, title: true, duration: true, isPreviewFree: true },
                    },
                },
            },
            _count: { select: { enrollments: true } },
        },
    });
    if (!course) return null;

    // Private courses are visible only to their own instructor (as a preview).
    const isOwner = viewer?.id === course.instructorId;
    if (!course.isPublished && !isOwner) return null;

    const [ratings, enrollment] = await Promise.all([
        ratingsFor([course.id]),
        viewer
            ? prisma.enrollment.findUnique({
                where: { userId_courseId: { userId: viewer.id, courseId: course.id } },
                select: { id: true },
            })
            : null,
    ]);

    const lectures = course.chapters.flatMap((c) => c.lectures);

    return {
        ...course,
        isOwner,
        isEnrolled: Boolean(enrollment),
        studentCount: course._count.enrollments,
        rating: ratings.get(course.id)?.avg ?? 0,
        ratingCount: ratings.get(course.id)?.count ?? 0,
        totalLectures: lectures.length,
        totalSeconds: lectures.reduce((sum, l) => sum + l.duration, 0),
    };
}