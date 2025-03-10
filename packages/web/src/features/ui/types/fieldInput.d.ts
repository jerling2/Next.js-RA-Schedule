type FieldInputState = {
    type?: string;
    placeholder?: string;
    value?: string;
    pattern?: string;
    isDisabled?: boolean;
    isValid?: boolean;
};

type OnChange = (e: React.ChangeEvent<HTMLInputElement>) => void;

interface FieldInputI {
    state: FieldInputState;
    onChange: OnChange;
};