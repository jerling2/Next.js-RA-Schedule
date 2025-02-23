"use client";
import { useEmailContext } from "@/auth";
import { FieldInput, SmallButton } from "@/ui";
import { auth } from "@/client/firebase";
import { signinEmail } from "@/client/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

export default function PasswordSignIn () {
    const {email} = useEmailContext();
    const [pass, setPass] = useState<string>("");
    const [shake, setShake] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            const UserCredentials = await signinEmail(email, pass);
            if (UserCredentials === undefined) {
                setError(true);
                setShake(true);
            } else {
                setError(false);
                router.push("/");
            }
        } catch {
            alert("Oops, something went wrong.");
            router.push("/");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div className='text-5xl mt-7 pb-2 h-fit font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text'>
          Sign in
        </div>
        <div className="w-[75%]">
            <div className={`w-full max-h-24 aspect-[4/1] bg-background-1 border-primary text-primary ${shake ? 'animate-shake' : ''}`}
            onAnimationEnd={() => setShake(false)}>
                <FieldInput 
                    type="password"
                    placeholder="Password" 
                    onChange={setPass} 
                    invalid={isError}/>
            </div>
            <div className='mt-4 w-fit p-1 font-bold text-accent  hover:bg-accent-hover rounded-full cursor-pointer '
                onClick={()=>{sendPasswordResetEmail(auth, email); router.push("forgotPassword")}}>
                Forgot password?
            </div>
        </div>
        <div className="flex flex-row justify-between w-[75%] h-12 mb-7 items-center">
        <div className='cursor-pointer hover:bg-accent-hover rounded-full p-2 text-accent font-bold'
            onClick={() => router.push('userIdentifier')}>
            Back    
            </div>
            <div className='w-24 h-full [&>*]:bg-primary [&>*]:hover:bg-primary-hover text-black'>
                <SmallButton onClick={handleFormSubmit} isLoading={isLoading}/>
            </div>
        </div>
        </>
      );
}