"use client";
import { useSignInContext } from "@/components/SignInProvider";
import FieldInput from "@/components/FieldInput";
import SmallButton from "@/components/NextButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signinEmail } from "@/lib/client/auth";

export default function PasswordSignIn () {
    const {email} = useSignInContext();
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
        } catch (error: unknown) {
            alert("Oops, something went wrong.");
            router.push("/");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div className='text-4xl mb-24 text-black'>
            Sign in
        </div>
        <div className='flex flex-col gap-y-2 place-items-start w-full h-1/5'>
          <div className={`w-full h-full ${shake ? 'animate-shake' : ''}`} onAnimationEnd={()=>setShake(false)}>
            <FieldInput type="password" placeholder="Password" onChange={setPass} invalid={isError}/>
          </div>
          <div className='cursor-pointer hover:bg-sky-100 rounded-full p-1 text-sky-500 font-bold'>
            Forgot password?
          </div>
        </div>
        <div className='flex flex-row w-full h-12 justify-between place-items-center'>
            <div className='cursor-pointer hover:bg-sky-100 rounded-full p-1 text-sky-500 font-bold'
            onClick={() => router.push('/signIn/userIdentifier')}>
            Back    
            </div>
            <div className='w-24 h-full'>
                <SmallButton onClick={handleFormSubmit} isLoading={isLoading}/>
            </div>
        </div>
        </>
      );
}