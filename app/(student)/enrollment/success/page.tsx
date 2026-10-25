import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ToastOnMount } from "@/components/ui/toast-on-mount";
import { CheckoutRefresher } from "@/components/student/checkout-refresher";

export default async function EnrollmentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string; course?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const sp = await searchParams;
    let courseId: string | null = null;

    if (typeof sp.session_id === "string") {
        // paid course: check with Stripe that this session is really ours and paid
        try {
            const session = await stripe.checkout.sessions.retrieve(sp.session_id);
            if (session.metadata?.userId === user.id && session.payment_status === "paid") {
                courseId = session.metadata.courseId ?? null;
            }
        } catch {
            courseId = null;
        }
    } else if (typeof sp.course === "string") {
        // free course: valid only if the enrollment really exists
        courseId = sp.course;
    }

    if (!courseId) redirect("/courses");

    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
        select: { course: { select: { id: true, title: true, thumbnailUrl: true } } },
    });

    // free-course link without an enrollment is not valid
    if (!enrollment && !sp.session_id) redirect("/courses");

    return (
        <main className="mx-auto flex max-w-[560px] flex-col items-center px-6 py-20 text-center">
            {enrollment ? (
                <>
                    <ToastOnMount message="Enrollment successful" />
                    <AssetIcon name="blue_tick_icon.svg" size={64} />
                    <h1 className="mt-6 text-3xl font-semibold text-[#0E0E0E]">You are enrolled!</h1>
                    <p className="mt-3 text-[#565656]">
                        Thank you for your purchase. You now have lifetime access to this course.
                    </p>

                    <div className="mt-8 w-full overflow-hidden rounded-lg border border-[#E3E3E3] text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={enrollment.course.thumbnailUrl}
                            alt=""
                            className="aspect-video w-full object-cover"
                        />
                        <p className="px-4 py-3 font-medium text-[#0E0E0E]">{enrollment.course.title}</p>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href={`/player/${enrollment.course.id}`}
                            className="rounded bg-[#2563EB] px-8 py-3 text-white hover:bg-blue-700"
                        >
                            Start learning
                        </Link>
                        <Link
                            href="/my-enrollments"
                            className="rounded border border-[#E3E3E3] px-8 py-3 text-[#404040] hover:bg-gray-50"
                        >
                            My Enrollments
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-semibold kkkkkktext-[#0E0E0E]">Payment received</h1>
                    <p className="mb-8 mt-3 text-[#565656]">We are finishing your enrollment.</p>
                    <CheckoutRefresher />
                </>
            )}
        </main>
    );
}