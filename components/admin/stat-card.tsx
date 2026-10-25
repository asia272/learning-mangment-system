import type { LucideIcon } from "lucide-react";

type Props = { icon: LucideIcon; value: string | number; label: string };

export function AdminStatCard({ icon: Icon, value, label }: Props) {
    return (
        <div className="flex min-w-56 items-center gap-4 rounded-lg border border-blue-500 bg-white px-5 py-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <Icon className="h-7 w-7" />
            </span>
            <div>
                <p className="text-3xl font-semibold text-gray-800">{value}</p>
                <p className="text-gray-500">{label}</p>
            </div>
        </div>
    );
}