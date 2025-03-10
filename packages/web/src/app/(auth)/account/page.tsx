"use client";

import { redirect } from "next/navigation";

export default function Page() {
    redirect('/account/sign-in'); //< Redirect user before this page renders.
}