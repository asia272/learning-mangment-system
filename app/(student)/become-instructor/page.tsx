import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { ApplyInstructorForm } from "@/components/student/apply-instructor-form";

export default async function BecomeInstructorPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in?redirect_url=/become-instructor");
    if (user.role === "INSTRUCTOR") redirect("/instructor");

    const latest = await prisma.instructorApplication.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="bg-gradient-to-b from-[#E6FFFF] to-white">
            <div className="mx-auto max-w-xl px-6 py-14">
                <h1 className="text-3xl font-semibold text-[#0E0E0E]">Become an Instructor</h1>
                <p className="mt-2 text-sm text-[#565656]">
                    Share your knowledge with students around the world. Tell us about yourself and
                    we&apos;ll review your application.
                </p>

                <div className="mt-8 rounded-lg border border-[#E3E3E3] bg-white p-6 shadow-sm">
                    {latest?.status === "PENDING" ? (
                        <div className="text-center">
                            <p className="text-lg font-medium text-[#0E0E0E]">Application under review</p>
                            <p className="mt-2 text-sm text-[#565656]">
                                Submitted on {latest.createdAt.toLocaleDateString()}. You&apos;ll get
                                instructor access as soon as it&apos;s approved.
                            </p>
                        </div>
                    ) : (
                        <>
                            {latest?.status === "REJECTED" && (
                                <div className="mb-6 rounded bg-red-50 p-4 text-sm text-red-700">
                                    Your previous application was not approved.
                                    {latest.reviewNote && <> Reason: {latest.reviewNote}</>} You can
                                    apply again below.
                                </div>
                            )}
                            <ApplyInstructorForm />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}