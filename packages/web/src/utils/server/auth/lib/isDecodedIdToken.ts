"use server";
import { DecodedIdToken } from "firebase-admin/auth";
import { DECODED_ID_TOKEN } from "@/server/auth";


export const isDecodedIdToken = (value: any): value is DecodedIdToken =>
    Object
        .keys(DECODED_ID_TOKEN)
        .every((key) => key in value && typeof value[key] === typeof DECODED_ID_TOKEN[key]);