import { requireInstructor } from "@/lib/auth";
import { getInstructorEnrolments } from "@/lib/queries/instructor";
import { EnrolmentsTable } from "@/components/instructor/enrolments-table";

export default async function StudentsEnrolledPage() {
    const user = await requireInstructor();
    const rows = await getInstructorEnrolments(user.id);

    return (
        <div>
            <h1 className="mb-8 text-xl font-semibold text-gray-800">Student Enrolled</h1>
            <EnrolmentsTable rows={rows} />
        </div>
    );
}