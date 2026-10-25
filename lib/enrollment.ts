import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Input = {
    userId: string;
    courseId: string;
    amountPaid: number; // cents
    stripeSessionId?: string | null;
    stripePaymentIntentId?: string | null;
};

export async function createEnrollment(input: Input) {
    // upsert on (userId, courseId): safe when Stripe retries the webhook
    const enrollment = await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: input.userId, courseId: input.courseId } },
        update: {},
        create: {
            userId: input.userId,
            courseId: input.courseId,
            amountPaid: input.amountPaid,
            currency: "usd",
            stripeSessionId: input.stripeSessionId ?? null,
            stripePaymentIntentId: input.stripePaymentIntentId ?? null,
        },
    });

    revalidatePath("/my-enrollments");
    revalidatePath("/instructor");
    revalidatePath("/instructor/my-courses");
    revalidatePath("/instructor/students");

    return enrollment;
}