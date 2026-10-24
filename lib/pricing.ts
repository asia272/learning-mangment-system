type PriceInfo = {
    price: number; // cents
    discountPercent: number;
    discountEndsAt: Date | null;
};

export function isDiscountActive(c: Pick<PriceInfo, "discountPercent" | "discountEndsAt">) {
    return (
        c.discountPercent > 0 &&
        (c.discountEndsAt === null || c.discountEndsAt.getTime() > Date.now())
    );
}

export function getFinalPrice(c: PriceInfo) {
    if (!isDiscountActive(c)) return c.price;
    return Math.round((c.price * (100 - c.discountPercent)) / 100);
}

export function daysLeft(date: Date) {
    return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86_400_000));
}