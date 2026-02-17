import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "EGP") {
    return new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: currency,
    }).format(value);
}

export function formatNumber(value: number) {
    return new Intl.NumberFormat("ar-EG").format(value);
}
