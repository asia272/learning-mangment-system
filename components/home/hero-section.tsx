import { SearchBox } from "@/components/student/search-box";

export function HeroSection() {
    return (
        <section className="bg-gradient-to-b from-[#E6FFFF] to-white">
            <div className="mx-auto max-w-[1000px] px-6 pb-14 pt-16 text-center md:pt-24">
                <h1 className="mx-auto max-w-[732px] text-[32px] font-bold leading-[1.2] text-[#0E0E0E] md:text-[46px]">
                    Empower your future with the courses designed to{" "}
                    <span className="relative inline-block whitespace-nowrap text-[#2563EB]">
                        fit your choice.
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/assets/sktech.svg"
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-5 left-20 w-[200px]"
                        />
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-[560px] text-base leading-6 text-[#565656]">
                    We bring together world-class instructors, interactive content, and a supportive
                    community to help you achieve your personal and professional goals.
                </p>

                <div className="mt-8">
                    <SearchBox />
                </div>
            </div>
        </section>
    );
}