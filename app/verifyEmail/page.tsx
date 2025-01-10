"use client"
import { useCallback, useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuthContext } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";

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
        <div className="relative w-screen h-screen flex justify-center place-items-center">
            <div className="relative flex flex-col place-items-center justify-around min-w-[600px] w-1/2 aspect-[4/3] bg-slate-50 drop-shadow-lg rounded-xl">
                <div className="text-lg font-bold">
                    A link has been sent to {displayEmail()}
                </div>
                <div className="text-lg">
                    You will be redirected automatically once you verify your email.
                </div>
                <div>
                    {timeLeft > 0 && 
                    <div>
                    You can resend the link in {timeLeft}
                    </div>}
                    {timeLeft === 0 && 
                    <button className="bg-sky-300 hover:bg-sky-400 transition-all duration-200 rounded-full p-4 text-slate-900 font-bold" onClick={() => resendLink()}>
                        Resend link
                    </button>}
                </div>
            </div>
        </div>
    );
}