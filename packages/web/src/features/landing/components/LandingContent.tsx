"use client";
import { SIGN_IN_BTN_TW, CREATE_ACC_BTN_TW } from '@/landing';
import { CenterContent, SquareContainer, FancyTitle, RoutingButton } from '@/ui';

export function LandingContent() {
    return (
        <CenterContent>
            <SquareContainer>
                <FancyTitle title='Welcome' />
                <RoutingButton route="/account/sign-in" label="Sign in" className={SIGN_IN_BTN_TW}/>
                <RoutingButton route="/account/create" label="Create an account" className={CREATE_ACC_BTN_TW} />
            </SquareContainer>
        </CenterContent>
    );
}
