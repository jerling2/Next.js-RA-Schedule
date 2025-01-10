"use client";
import { sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { auth, signinEmail } from "@/lib/client/auth";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/components/EmailProvider";
import { useState, useEffect } from "react";
import FieldInput from "@/components/FieldInput";
import { FirebaseError } from "firebase/app";
import SmallButton from "@/components/NextButton";

export default function forgotPassword () {
    const router = useRouter();
    const { email } = useEmailContext();
    const [timeLeft, setTimeLeft] = useState<number>(10);
    const minPassLen = 8;
    const maxPassLen = 128;
    const passUpper = '(?=(?:.*[A-Z]){1,})';
    const passLower = '(?=(?:.*[a-z]){1,})';
    const passDigit = '(?=(?:.*[0-9]){1,})';
    const passSpec = '(?=(?:.*[!@#$%^&*\\(\\)_\\-+=\\{\\}\\[\\]\\|\\\\:;"\'<,>.?\\/~`]){1,})'
    const passLen = `.{${minPassLen},${maxPassLen}}`;
    const passRegExpString = passUpper + passLower + passDigit + passSpec + passLen;
    const passRegExp = new RegExp('^' + passRegExpString + '$');
    const [match, setMatch] = useState<boolean>(false);
    const [shakes, setShakes] = useState<boolean[]>([false, false, false]);
    const [oobCode, setOobCode] = useState<string>('');
    const [oobInvalid, setOobInvalid] = useState<boolean>(false);
    const [oobCodePlaceholder, setOobCodePlaceholder] = useState<string>('Enter code');
    const [pass, setPass] = useState<string>('');
    const [passPlaceholder, setPassPlaceholder] = useState<string>('New password');
    const [conf, setConf] = useState<string>('');
    const [confPlaceholder, setConfPlaceholder] = useState<string>('Confirm password');
    const [loading, setLoading] = useState<boolean>(false);

    const fieldInputStyle = (index: number) => (
        `h-12 w-full ${shakes[index] ? 'animate-shake' : ''}`
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                return prev - (timeLeft > 0 ? 1 : 0);
            });
        }, 1000 /* ms */);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (pass !== conf) {
          setMatch(false);
          setConfPlaceholder("Does not match the password");
        } else {
          setMatch(true);
          setConfPlaceholder("Confirm password");
        }
      }, [pass, conf])

    const requestReset = async () => {
        setTimeLeft(10);
        sendPasswordResetEmail(auth, email);
    }

    const handleOobFieldInput = (textInput: string) => {
        setOobCode(textInput);
        setOobInvalid(false);
        setOobCodePlaceholder("Enter code");
    }

    const handleShakes = (index: number, isShake: boolean) => {
        setShakes((prev) => {
          const updatedShakes = [...prev];
          updatedShakes[index] = isShake;
          return updatedShakes;
        });
      }
    
      const greedyCheckPassword = (pass: string): string => {
        if (!RegExp(`^${passUpper}.*$`).test(pass)) {
          return "needs an uppercase letter";
        } else if (!RegExp(`^${passLower}.*$`).test(pass)) {
          return "needs a lowercase letter";
        } else if (!RegExp(`^${passDigit}.*$`).test(pass)) {
          return "needs a digit";
        } else if (!RegExp(`^${passSpec}.*$`).test(pass)) {
          return "needs a special character";
        } else if (!RegExp(`^.{${minPassLen},}$`).test(pass)) {
          return `is too short`
        } else if (!RegExp(`^.{,${maxPassLen}}$`).test(pass)) {
          return `is too long`
        }
        return "";
      }

      const handleFormSubmit = async () => {
        setLoading(true);
        const testPassRegExp = passRegExp.test(pass);

        if (testPassRegExp && match && !!oobCode) {
            try {
                await confirmPasswordReset(auth, oobCode, pass);
                await signinEmail(email, pass);
                router.push("/");
            } catch(error: unknown) {
                if (error instanceof FirebaseError) {
                    if (error.code === "auth/invalid-action-code") {
                        handleShakes(0, true);
                        setOobCodePlaceholder("Wrong code - please try again");
                        setOobInvalid(true);
                    } else {
                        alert(`Firebase error: ${error.code}`);
                    }
                } else {
                    alert(`Uncaught error: ${error}`);
                }
            } finally {
                setLoading(false);
            }
        }
        if (!oobCode) {
            handleShakes(0, true);
        }
        if (!testPassRegExp) {
            setPassPlaceholder('New password ' + greedyCheckPassword(pass));
            handleShakes(1, true);
        } else {
            setPassPlaceholder('New password')
        }
        if (!match) {
            setConfPlaceholder("Does not match the password");
            handleShakes(2, true);
        } else {
            setConfPlaceholder("Confirm password");
        }
        setLoading(false);
      }

    return (
        <div className="relative flex flex-col w-full h-full justify-center place-items-center gap-y-10">
            {timeLeft > 0 && <div>
                You can resend the link in ... {timeLeft} seconds
            </div>}
            {timeLeft === 0 && <button className="p-4 bg-sky-500 rounded-full font-bold text-white cursor-pointer hover:bg-sky-600" onClick={() => requestReset()}>
                Send a password reset link to {email}
            </button>}
            <div className={fieldInputStyle(0)} onAnimationEnd={()=>handleShakes(0, false)}>
                <FieldInput placeholder={oobCodePlaceholder} value={oobCode} onChange={handleOobFieldInput} invalid={oobInvalid} />
            </div>
            <div className={fieldInputStyle(1)} onAnimationEnd={()=>handleShakes(1, false)}>
                <FieldInput type="password" placeholder={passPlaceholder} pattern={passRegExpString} value={pass} onChange={setPass} />
            </div>
            <div className={fieldInputStyle(2)} onAnimationEnd={()=>handleShakes(2, false)}>
                <FieldInput type="password" placeholder={confPlaceholder} value={conf} onChange={setConf} invalid={!match} />
            </div>
            <div className="flex flex-row justify-around w-full place-items-center">
                <div className="font-bold text-sky-800 place-self cursor-pointer hover:bg-sky-100 p-4 rounded-full"
                    onClick={() => router.push("userPassword")}>
                    Go back
                </div>

                <div className="font-bold text-white [&>button]:p-1 [&>div]:p-1 aspect-[4/3] min-w-fit bg-sky-500 hover:bg-sky-600 cursor-pointer rounded-full">
                    <SmallButton value="Submit" isLoading={loading} onClick={() => {handleFormSubmit()}}/>
                </div>
            </div>
        </div>
    );
}