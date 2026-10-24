import { StudentNavbar } from "@/components/student/navbar";

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white">
            <StudentNavbar />
            {children}
        </div>
    );
}