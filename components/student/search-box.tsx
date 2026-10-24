export function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
    return (
        <form
            action="/courses"
            method="get"
            role="search"
            className="mx-auto flex h-[50px] w-full max-w-[528px] items-center gap-3 rounded-[5px] border border-[#E3E3E3] bg-white pl-4 pr-2 shadow-sm"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/search_icon.svg" alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
            <input
                type="text"
                name="q"
                defaultValue={defaultValue}
                placeholder="Search for courses"
                maxLength={100}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#0E0E0E] placeholder:text-[#565656] focus:outline-none"
            />
            <button
                type="submit"
                className="h-9 w-[110px] shrink-0 rounded-[5px] bg-[#2563EB] text-sm text-white hover:bg-blue-700"
            >
                Search
            </button>
        </form>
    );
}