import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createEnrollment } from "@/lib/enrollment";

export const runtime = "nodejs"; // the signature check needs Node crypto

async function fulfill(session: Stripe.Checkout.Session) {
    // card payments are "paid" immediately; delayed methods arrive later
    if (session.payment_status !== "paid") return;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;
    if (!userId || !courseId) {
        console.error("Stripe webhook: missing metadata on session", session.id);
        return;
    }

    const [user, course] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
        prisma.course.findUnique({ where: { id: courseId }, select: { id: true } }),
    ]);
    if (!user || !course) {
        console.error("Stripe webhook: user or course not found", session.id);
        return;
    }

    const paymentIntent =
        typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

    await createEnrollment({
        userId,
        courseId,
        amountPaid: session.amount_total ?? 0,
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntent,
    });
}

export async function POST(req: Request) {
    const signature = req.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature || !secret) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // the raw body is required: parsing it as JSON first would break the signature
    const body = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
        console.error("Stripe webhook: bad signature", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        if (
            event.type === "checkout.session.completed" ||
            event.type === "checkout.session.async_payment_succeeded"
        ) {
            await fulfill(event.data.object as Stripe.Checkout.Session);
        }
    } catch (err) {
        // a 500 makes Stripe retry later
        console.error("Stripe webhook: handler failed", err);
        return NextResponse.json({ error: "Handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}