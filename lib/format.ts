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