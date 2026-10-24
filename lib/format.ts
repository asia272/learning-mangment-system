export function formatMoney(cents: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(cents / 100);
}

// 22 Aug, 2024
export function formatDate(date: Date) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).formatToParts(date);

    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${get("day")} ${get("month")}, ${get("year")}`;
}
export function plural(n: number, word: string) {
    return `${n} ${word}${n === 1 ? "" : "s"}`;
}

// 10 mins
export function formatLectureMinutes(seconds: number) {
    return `${Math.max(1, Math.round(seconds / 60))} mins`;
}

// 27h 25m  /  45m
export function formatTotalDuration(seconds: number) {
    const total = Math.round(seconds / 60);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// 30 hours
export function formatHours(seconds: number) {
    const h = Math.round((seconds / 3600) * 10) / 10;
    return `${h} ${h === 1 ? "hour" : "hours"}`;
}