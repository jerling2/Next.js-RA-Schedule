"use client";

import { CenterContent, FancyTitle, SquareContainer } from "@/ui";
import { EmailFieldInput } from "@/signIn";

export function SignInContent() {
    // center screen
    // square
    // title
    // field input

    return (
        <CenterContent>
            <SquareContainer>
                <FancyTitle title="Sign In"/>
                <EmailFieldInput />
                <div>

                </div>
            </SquareContainer>
        </CenterContent>
    );
}