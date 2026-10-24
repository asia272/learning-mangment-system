import { Users, BookOpen, CircleDollarSign } from "lucide-react";
import { requireInstructor } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries/instructor";
import { formatMoney } from "@/lib/format";
import { StatCard } from "@/components/instructor/stat-card";
import { EnrolmentsTable } from "@/components/instructor/enrolments-table";

export default async function InstructorDashboardPage() {
    const user = await requireInstructor();
    const data = await getDashboardData(user.id);

    return (
        <div className="space-y-10">
            <div className="flex flex-wrap gap-6">
                <StatCard icon="/assets/patients_icon.svg" value={data.totalEnrolments} label="Total Enrolment" />
                <StatCard icon="/assets/appointments_icon.svg" value={data.totalCourses} label="Total Courses" />
                <StatCard icon="/assets/earning_icon.svg" value={data.totalEarnings} label="Total Earnings" />
            </div>

            <section>
                <h2 className="mb-5 text-lg font-semibold text-gray-800">Latest Enrolments</h2>
                <EnrolmentsTable rows={data.latest} />
            </section>
        </div>
    );
}