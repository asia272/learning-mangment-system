"use server";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createEnrollment } from "@/lib/enrollment";
import { getFinalPrice } from "@/lib/pricing";

type Result = { success: true; url: string } | { success: false; error: string };

export async function startCheckout(courseId: string): Promise<Result> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Please sign in to enroll." };

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            price: true,
            discountPercent: true,
            discountEndsAt: true,
            isPublished: true,
            instructorId: true,
        },
    });
    if (!course || !course.isPublished) {
        return { success: false, error: "This course is not available." };
    }
    if (course.instructorId === user.id) {
        return { success: false, error: "You cannot enroll in your own course." };
    }

    const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
        select: { id: true },
    });
    if (existing) return { success: true, url: "/my-enrollments" };

    // the price always comes from the database, never from the browser
    const amount = getFinalPrice(course);

    if (amount === 0) {
        await createEnrollment({ userId: user.id, courseId: course.id, amountPaid: 0 });
        return { success: true, url: "/my-enrollments" };
    }
    if (amount < 50) {
        return { success: false, error: "Stripe cannot charge less than $0.50." };
    }

    const appUrl = process.env.APP_URL;
    if (!appUrl) return { success: false, error: "Payments are not configured." };

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment", // one-time payment
            customer_email: user.email,
            client_reference_id: user.id,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        unit_amount: amount,
                        product_data: { name: course.title, images: [course.thumbnailUrl] },
                    },
                },
            ],
            metadata: { userId: user.id, courseId: course.id },
            payment_intent_data: { metadata: { userId: user.id, courseId: course.id } },
            success_url: `${appUrl}/my-enrollments?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/courses/${course.id}`,
        });

        if (!session.url) return { success: false, error: "Could not start the payment." };
        return { success: true, url: session.url };
    } catch (err) {
        console.error("Stripe checkout failed", err);
        return { success: false, error: "Could not start the payment. Please try again." };
    }
}