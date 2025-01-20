"use client";

interface TextInputProps {
    type?: string;
    placeholder?: string;
    value?: string | undefined;
    onChange?: (textInput: string) => void;
    pattern?: string;
    disabled?: boolean;
    invalid?: boolean;
};

export default function TextInput({ type="text", placeholder="", value=undefined, onChange=()=>{}, pattern=".*", disabled=false, invalid=false}: TextInputProps) {
    const inputInvalid = invalid ? 'border-invalid text-invalid' : 'border-inherit invalid:border-invalid focus:border-focus'
    const placeholderInvalid = invalid ? 'text-invalid' : 'text-inherit peer-invalid/input:text-invalid peer-focus/input:text-focus'
    const pseudoPlaceHolder = placeholder === "" ? "" : `.${placeholder}.`;
    return (
        <div className="relative flex w-full h-full text-lg place-items-center bg-inherit border-inherit">
            <input type={type} 
                className={`peer/input px-4 w-full h-full border-solid border-2 rounded-md drop-shadow-md focus:outline-none ${inputInvalid} bg-inherit disabled:text-focus disabled:border-focus`}
                placeholder=""
                pattern={pattern}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                value={value}
            />
            <div className={`absolute pointer-events-none select-none font-bold text-sm top-0 translate-x-2 -translate-y-1/2 px-1 scale-y-[0.25] text-transparent bg-inherit
                            ransition-all ease-in-out 
                            peer-focus/input:text-sm 
                            peer-placeholder-shown/input:text-base peer-placeholder-shown/input:top-1/2 peer-placeholder-shown/input:font-normal
                            peer-placeholder-shown/input:peer-focus/input:top-0 peer-placeholder-shown/input:peer-focus/input:font-bold`}>
                {pseudoPlaceHolder}
            </div>
            <div className={`absolute pointer-events-none select-none font-bold text-sm top-0 translate-x-4 -translate-y-1/2 
                            transition-all ease-in-out 
                            peer-focus/input:text-sm 
                            ${placeholderInvalid}
                            peer-disabled/input:text-focus peer-disabled/input:transition-none
                            peer-placeholder-shown/input:text-base peer-placeholder-shown/input:top-1/2 peer-placeholder-shown/input:font-normal
                            peer-placeholder-shown/input:peer-focus/input:top-0 peer-placeholder-shown/input:peer-focus/input:font-bold`}>
                {placeholder}
            </div>
        </div>
    )
};
