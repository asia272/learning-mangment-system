import { requireInstructor } from "@/lib/auth";
import { InstructorSidebar } from "@/components/instructor/sidebar";

export default async function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireInstructor();

    return (
        <div className="flex min-h-screen bg-white">
            <InstructorSidebar />
            <main className="min-w-0 flex-1 p-6 md:p-10">{children}</main>
        </div>
    );
}