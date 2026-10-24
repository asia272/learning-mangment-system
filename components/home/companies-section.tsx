const logos = [
    { file: "microsoft_logo.svg", name: "Microsoft" },
    { file: "walmart_logo.svg", name: "Walmart" },
    { file: "accenture_logo.svg", name: "Accenture" },
    { file: "adobe_logo.svg", name: "Adobe" },
    { file: "paypal_logo.svg", name: "PayPal" },
];

export function CompaniesSection() {
    return (
        <section className="pb-20 pt-6">
            <div className="mx-auto max-w-[1000px] px-6 text-center">
                <p className="text-sm text-[#565656]">Trusted by learners from</p>

                <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
                    {logos.map((logo) => (
                        <li key={logo.file}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`/assets/${logo.file}`} alt={logo.name} className="h-7 w-auto md:h-8" />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}