import { Avatar } from "./avatar";
import { formatDate } from "@/lib/format";

export type EnrolmentRow = {
    id: string;
    createdAt: Date;
    user: { name: string | null; email: string; imageUrl: string | null };
    course: { title: string };
};

export function EnrolmentsTable({ rows }: { rows: EnrolmentRow[] }) {
    if (rows.length === 0) {
        return (
            <p className="rounded-lg border border-gray-300 p-8 text-center text-gray-500">
                No enrolments yet.
            </p>
        );
    }

    return (
        <div className="max-w-5xl overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full text-left">
                <thead className="border-b border-gray-300 text-gray-900">
                    <tr>
                        <th className="hidden px-4 py-4 font-semibold sm:table-cell">#</th>
                        <th className="px-4 py-4 font-semibold">Student name</th>
                        <th className="px-4 py-4 font-semibold">Course Title</th>
                        <th className="hidden px-4 py-4 font-semibold sm:table-cell">Date</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600">
                    {rows.map((row, i) => {
                        const name = row.user.name ?? row.user.email;
                        return (
                            <tr key={row.id} className="border-b border-gray-200 last:border-0">
                                <td className="hidden px-4 py-4 sm:table-cell">{i + 1}</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={name} src={row.user.imageUrl} />
                                        <span>{name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">{row.course.title}</td>
                                <td className="hidden whitespace-nowrap px-4 py-4 sm:table-cell">
                                    {formatDate(row.createdAt)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}