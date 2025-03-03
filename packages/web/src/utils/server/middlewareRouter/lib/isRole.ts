"use server";
import { Role } from '@/server/middlewareRouter';


export const isRole = (value: string): value is Role =>
    Object.values(Role).includes(value as Role);