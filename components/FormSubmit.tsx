"use client";
import { useState, AnimationEvent } from 'react';

interface TextInputProps { 
    label: string;
    placeholder: string;
    value: string;
    causeShake: boolean;
    regExp: string;
    onChange: (value: string) => void;
    onAnimationEnd: (e: AnimationEvent) => void;
};

function TextInput({ label, placeholder, value, regExp, causeShake, onChange, onAnimationEnd }: TextInputProps) {
    return (
        <div className="relative w-full">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                pattern={regExp}
                value={value}
                onAnimationEnd={(e) => onAnimationEnd(e)}
                onChange={(e) => onChange(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500 ${causeShake ? 'animate-shake' : ''}`}>
            </input>
        </div>
    );
};

interface SubmitProps {
    onClick: () => void;
};

function Submit({ onClick }: SubmitProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="select-none cursor-pointer mt-1 block w-full px-3 py-2 bg-sky-500 border border-sky-400 rounded-md text-sm shadow-sm font-bold text-white
            hover:bg-sky-600 hover:border-sky-500 transition-all ease-in-out duration-200">
            Submit
        </button>
    );
}


interface FormSubmitProps {
    onFormSubmit: (user: string, uoid: string) => void;
    formError: string;
};

export default function FormSubmit({ onFormSubmit, formError }: FormSubmitProps) {
    const regexNameString = "^[A-z\\-\\s']+$";
    const regexUoidString = "^95\\d{7}$"
    const regexName = RegExp(regexNameString);
    const regexUoid = RegExp(regexUoidString);

    const [user, setUser] = useState<{[key: string]: string}>({
        'name': '',
        'uoid': ''
    });

    const [shakes, setShakes] = useState<boolean[]>(Array(2).fill(false));

    const textInputHandler = (key: string, value: string) => {
        setUser((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleAnimationEnd = (index: number, event: AnimationEvent) => {
        if (event.animationName === "shake") {
            setShakes((prev) => { // using a callback function prevents data races.
                const updatedShakes = [...prev];
                updatedShakes[index] = false;
                return updatedShakes;
            });
        }
    }

    const submitHandler = () => {
        const updatedShakes = [!regexName.test(user['name']), !regexUoid.test(user['uoid'])]
        if (updatedShakes.includes(true)) {
            setShakes(updatedShakes);
        } else {
            onFormSubmit(user['name'], user['uoid']);
        }
    }

    return (
        <div className="flex flex-row justify-center">
            <div className="w-4/5 max-w-4xl flex flex-col place-items-center p-4">
                <div className="w-1/4 flex flex-col gap-y-4 place-items-center">
                    <TextInput label={"Name"} placeholder={"John Doe"} value={user['name']} regExp={regexNameString} causeShake={shakes[0]} onChange={(value) => textInputHandler('name', value)} onAnimationEnd={(event) => handleAnimationEnd(0, event)} />
                    <TextInput label={"UOID"} placeholder={"951234567"} value={user['uoid']} regExp={regexUoidString} causeShake={shakes[1]} onChange={(value) => textInputHandler('uoid', value)} onAnimationEnd={(event) => handleAnimationEnd(1, event)} />
                    <p className="text-red-500 text-sm text-left place-self-stretch">{formError}</p>
                    <Submit onClick={submitHandler} />
                </div>
            </div>
        </div>
    );
};

