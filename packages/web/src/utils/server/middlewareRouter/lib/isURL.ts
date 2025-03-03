"use server";

export const isURL = (value: any): value is URL => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
} 