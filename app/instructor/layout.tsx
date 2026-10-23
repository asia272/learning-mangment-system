import { requireInstructor } from "@/lib/auth";
import { InstructorHeader } from "@/components/instructor/header";
import { InstructorSidebar } from "@/components/instructor/sidebar";

export default async function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireInstructor();
    const firstName = (user.name ?? user.email).split(" ")[0];

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">
            <InstructorHeader name={firstName} imageUrl={user.imageUrl} />

            <div className="flex min-h-0 flex-1">
                <InstructorSidebar />
                <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
            </div>
        </div>
    );
}