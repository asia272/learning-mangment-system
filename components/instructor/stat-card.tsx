import Image from "next/image";

type Props = { icon: string; value: string | number; label: string };

export function StatCard({ icon, value, label }: Props) {
    return (
        <div className="flex h-[99px] w-[230px] items-center gap-3 rounded-[6px] border border-[#0260FF] bg-white px-[18px] shadow-[0px_0px_4px_0px_#0000001A]">
            <Image
                src={icon}
                alt={label}
                width={57}
                height={57}
                className="h-[56.62px] w-[56.62px] shrink-0"
            />
            <div className="flex flex-col gap-2">
                <p className="text-2xl font-medium leading-none text-[#252525]">
                    {value}
                </p>
                <p className="text-base font-medium leading-none text-[#252525]">
                    {label}
                </p>
            </div>
        </div>
    );
}