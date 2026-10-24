import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const links = [
    { label: "Home", href: "/" },
    { label: "About us", href: "#" },
    { label: "Contact us", href: "#" },
    { label: "Privacy policy", href: "#" },
];

export function StudentFooter() {
    return (
        <footer className={`${inter.className} bg-[#111820] text-gray-300`}>
            <div className="mx-auto max-w-[1000px] px-6 pt-14">
                <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1.4fr]">
                    <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/logo_dark.svg" alt="Edemy" className="h-9 w-auto" />
                        <p className="mt-6 max-w-[317px] text-sm font-normal leading-[30px]">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                            Ipsum has been the industry&apos;s standard dummy text.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">Company</h3>
                        <ul className="mt-5 space-y-3 text-sm">
                            {links.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="hover:text-white">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">Subscribe to our newsletter</h3>
                        <p className="mt-5 max-w-xs text-sm leading-6">
                            The latest news, articles, and resources, sent to your inbox weekly.
                        </p>
                        {/* Visual only for now: it is not connected to anything yet. */}
                        <form className="mt-5 flex gap-3" action="#">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Email address"
                                className="h-10 min-w-0 flex-1 rounded border border-gray-700 bg-[#1F2937] px-3 text-sm text-white placeholder:text-gray-400 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="h-10 shrink-0 rounded bg-[#2563EB] px-4 text-sm text-white hover:bg-blue-700"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-12 border-t border-gray-600 py-5 text-center text-sm">
                    Copyright {new Date().getFullYear()} © Edemy. All Right Reserved.
                </p>
            </div>
        </footer>
    );
}