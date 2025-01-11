"use client"
import { useCallback, useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuthContext } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import SmallButton from "@/components/NextButton";


export default function VerifyEmail() {
    const router = useRouter();
    const { user } = useAuthContext();
    const searchParams = useSearchParams();
    const [timeLeft, setTimeLeft] = useState<number>(10);
    const [pollUser, setPollUser] = useState<number>(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - (timeLeft > 0 ? 1 : 0))
        }, 1000 /* ms */);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const resendLink = async () => {
        if (user === null) {
            alert("Whoops! You got logged out. Try signing back in.");
            return router.push("/signIn/userIdentifier");
        }
        try {
            sendEmailVerification(user);
            setTimeLeft(10);
        } catch (error: unknown) {
            alert(`Unknown error: ${error}`);
            router.push("/");
        }
    }

    useEffect(() => {
        const pollTimer = setInterval(() => {
            setPollUser((prevTime) => prevTime - (pollUser > 0 ? 1 : 0));
        }, 1000 /* ms */); 
        if (user?.emailVerified === true) {
            router.push("/");
        }
        if (pollUser === 0) {
            user?.reload();
            setPollUser(!!user ? 5 : 0);
        }
        return () => clearInterval(pollTimer);
    }, [user, pollUser]);

    const displayEmail = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        return params.get('email');
    }, [searchParams]);

    return (
        <div className="relative flex flex-row h-screen justify-center items-center">
            <div className="relative flex flex-col min-w-[450px] w-1/3 aspect-square justify-between bg-background-2 shadow-color items-center rounded-2xl [&>*]:w-[75%]">
                <div className="text-xl mt-7 h-fit font-bold text-center">
                    A link has been sent to <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">{displayEmail()}</span>
                </div>
                <div className="text-lg">
                    You will be redirected automatically once you verify your email.
                </div>

                <div className="flex h-12 justify-center items-center mb-7">
                    { timeLeft === 0 && 
                    <div className="font-bold text-black cursor-pointer h-full w-fit [&>*]:p-2 [&>*]:bg-primary text-black [&>*]:hover:bg-primary-hover rounded-full" > 
                        <SmallButton value="Resend link" 
                        onClick={() => resendLink()} />
                    </div>}
                    {timeLeft > 0 &&
                    <div>
                        You can resend the link in {timeLeft}
                    </div>}
                </div>
            </div>
        </div>
    );
}