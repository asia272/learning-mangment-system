import { StudentNavbar } from "@/components/student/navbar";
import { StudentFooter } from "@/components/student/footer";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <StudentNavbar />
            <div className="flex-1 pt-[76px]">{children}</div>
            <StudentFooter />
        </div>
    );
}