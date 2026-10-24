import { StudentNavbar } from "@/components/student/navbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white">
            <StudentNavbar />
            {children}
        </div>
    );
}