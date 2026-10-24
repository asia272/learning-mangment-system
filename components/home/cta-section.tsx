import Link from "next/link";

export function CtaSection() {
    return (
        <section className="pb-28">
            <div className="mx-auto max-w-[1000px] px-6 text-center">
                <h2 className="mx-auto max-w-[608px] text-[30px] font-semibold leading-[1.15] text-[#1F2937] md:text-[38px] md:leading-[44px]">
                    Learn anything, anytime, anywhere
                </h2>
                <p className="mx-auto mt-5 max-w-[500px] text-base leading-6 text-[#1F2937]">
                    Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua
                    proident excepteur commodo do ea.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                    <Link
                        href="/courses"
                        className="flex h-[42px] w-[146px] items-center justify-center rounded-[5px] bg-[#2563EB] text-sm text-white hover:bg-blue-700"
                    >
                        Get started
                    </Link>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 text-sm text-[#1F2937] hover:underline"
                    >
                        Learn more
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/arrow_icon.svg" alt="" aria-hidden="true" className="h-3 w-3" />
                    </Link>
                </div>
            </div>
        </section>
    );
}