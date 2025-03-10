"use client";
import { useTypeState } from "@/shared/typeState";
import { FieldInput } from "@/ui";


export function EmailFieldInput() {
    const [state, updateState] = useTypeState<FieldInputState>({
        type: "text",
        placeholder: "email",
    });

    const handleChange: OnChange = (e) => {
        updateState('value', e.target.value);
    }

    return (
        <div className="w-2/3 h-[40px] bg-background-2 border-primary text-accent">
            <FieldInput state={state} onChange={handleChange}/>
        </div>
    );
}