interface TextInputProps {
    type?: string;
    placeholder?: string;
    value?: string | undefined;
    onChange?: (textInput: string) => void;
    pattern?: string;
    disabled?: boolean;
    invalid?: boolean;
};