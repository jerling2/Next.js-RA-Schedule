"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/client/auth";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import FieldInput from "@/components/FieldInput";
import SmallButton from "@/components/NextButton";

export default function CreateAccount() {
  const router = useRouter();
  const emailRegExp = /.+@.+/
  const emailRegExpString = ".+@.+"
  const minPassLen = 8;
  const maxPassLen = 128;
  const passUpper = '(?=(?:.*[A-Z]){1,})';
  const passLower = '(?=(?:.*[a-z]){1,})';
  const passDigit = '(?=(?:.*[0-9]){1,})';
  const passSpec = '(?=(?:.*[!@#$%^&*\\(\\)_\\-+=\\{\\}\\[\\]\\|\\\\:;"\'<,>.?\\/~`]){1,})'
  const passLen = `.{${minPassLen},${maxPassLen}}`;
  const passRegExpString = passUpper + passLower + passDigit + passSpec + passLen;
  const passRegExp = new RegExp('^' + passRegExpString + '$');
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [conf, setConf] = useState<string>('');
  const [match, setMatch] = useState<boolean>(true);
  const [shakes, setShakes] = useState<boolean[]>([false, false, false]);
  const [emailPlaceholder, setEmailPlaceholder] = useState<string>('Email');
  const [passPlaceholder, setPassPlaceholder] = useState<string>('Password');
  const [confPlaceholder, setConfPlaceholder] = useState<string>('Confirm password');
  const [loading, setLoading] = useState<boolean>(false);

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
    const testEmailRegExp: boolean = emailRegExp.test(email);
    const testPassRegExp: boolean = passRegExp.test(pass);
    if (testEmailRegExp && testPassRegExp && match) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        sendEmailVerification(userCredential.user);
        router.push(`/verifyEmail?email=${email}`);
      } catch(error: unknown) {
        if (error instanceof FirebaseError) {
          if (error.code === "auth/email-already-in-use") {
            setEmailPlaceholder("Email already taken");
            handleShakes(0, true);
          } else if (error.code === "auth/invalid-email") {
            setEmailPlaceholder("Invalid email");
            handleShakes(0, true);
          } else if (error.code === "auth/invalid-password") {
            setPassPlaceholder("Password is too short");
            handleShakes(1, true);
          } else {
            alert(`Firebase error: ${error.code}`);
          }
        } else {
          alert(`Unknown error: ${error}`);
        }
      } finally {
        setLoading(false);
        return;
      }
    }
    if (email === '') {
      setEmailPlaceholder("Email");
      handleShakes(0, true);
    } else if (!testEmailRegExp) {
      setEmailPlaceholder("Invalid email");
      handleShakes(0, true);
    } else {
      setEmailPlaceholder("Email");
    }
    if (pass === '') {
      setPassPlaceholder('Password');
      handleShakes(1, true);
    }
    else if (!testPassRegExp) {
      setPassPlaceholder('Password ' + greedyCheckPassword(pass));
      handleShakes(1, true);
    } else {
      setPassPlaceholder('Password');
    }
    if (!match) {
      setConfPlaceholder("Does not match the password");
      handleShakes(2, true);
    } else {
      setConfPlaceholder("Confirm password");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (pass !== conf && conf !== '') {
      setMatch(false);
    } else {
      setMatch(true);
    }
  }, [pass, conf])

  return (
    <div className="relative flex flex-row h-screen justify-center items-center">
      <div className="relative flex flex-col min-w-[400px] w-1/3 aspect-square justify-between bg-background-2 shadow-color items-center rounded-2xl">
        
          <div className="text-3xl mt-7 font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            Create Account
          </div>
          <div className="w-[75%]">
            <div className={`border-primary text-primary bg-background-1 w-full max-h-16 aspect-[4/1] ${shakes[0] ? 'animate-shake' : ''}`} 
            onAnimationEnd={()=>handleShakes(0, false)}>
                <FieldInput 
                type="text" 
                value={email} 
                onChange={setEmail} 
                placeholder={emailPlaceholder} 
                pattern={emailRegExpString} 
                invalid={shakes[0]} />
            </div>
            <div className="font-bold w-fit h-fit mt-2 text-accent hover:bg-accent-hover p-2 rounded-full cursor-pointer"
            onClick={() => router.push("/signIn/userIdentifier")}>
              Already have an account?
            </div>
          </div>
          <div className={`w-[75%] max-h-16 aspect-[4/1] border-primary text-primary bg-background-1 ${shakes[1] ? 'animate-shake' : ''}`} 
          onAnimationEnd={()=>handleShakes(1, false)}>
            <FieldInput 
            type="password" 
            placeholder={passPlaceholder} 
            pattern={passRegExpString} 
            value={pass} 
            onChange={setPass}  
            invalid={shakes[1]}  />
          </div>
          <div className={`w-[75%] max-h-16 aspect-[4/1] border-primary text-primary bg-background-1 ${shakes[2] ? 'animate-shake' : ''}`}
          onAnimationEnd={()=>handleShakes(2, false)}>
            <FieldInput 
            type="password" 
            placeholder={confPlaceholder}
            value={conf}
            onChange={setConf}
            invalid={!match} />
          </div>
          <div className="flex w-[75%] mb-7 justify-end items-center">
            <div className="h-12 aspect-[2/1] text-black [&>*]:bg-primary [&>*]:hover:bg-primary-hover">
              <SmallButton 
              isLoading={loading} 
              onClick={handleFormSubmit} />
            </div>
          </div>

          {/* <div className="flex flex-col w-1/2 h-full justify-between">
            <div className="flex flex-col gap-y-2">
              <div className={fieldInputStyle(0)} onAnimationEnd={()=>handleShakes(0, false)}>
                <FieldInput type="text" value={email} onChange={setEmail} placeholder={emailPlaceholder} pattern={emailRegExpString} invalid={shakes[0]} />
              </div>
              <div className="text-base text-sky-500 cursor-pointer p-1 hover:bg-sky-100 w-fit rounded-full" onClick={() => router.push("/signIn/userIdentifier")}>
                Already have an account?
              </div>
            </div>
            <div className={fieldInputStyle(1)} onAnimationEnd={()=>handleShakes(1, false)}>
              <FieldInput type="password" placeholder={passPlaceholder} pattern={passRegExpString} value={pass} onChange={setPass}  invalid={shakes[1]}  />
            </div>
            <div className={fieldInputStyle(2)} onAnimationEnd={()=>handleShakes(2, false)}>
              <FieldInput type="password" placeholder={confPlaceholder} value={conf} onChange={setConf} invalid={!match} />
            </div>
            <div className="relative flex flex-row w-full justify-end">
              <div className="h-12 aspect-[2/1]">
                <SmallButton isLoading={loading} onClick={handleFormSubmit} />
              </div>
            </div>  
          </div>
        </div> */}
      </div>
    </div>
  );
}