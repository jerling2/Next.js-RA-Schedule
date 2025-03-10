"use client";

/**
 * Important: The FieldInput component inherits its border, background, and text color from its parent.
 */
export function FieldInput({ state, onChange }: FieldInputI) {
  const { type, placeholder, value, pattern, isDisabled, isValid } = state;

  const inputConditionalStyle =
    isValid || isValid === undefined
      ? "border-inherit invalid:border-invalid focus:border-focus"
      : "border-invalid text-invalid"; //< Override default styling the invalid template.

  const placeholderConditionalStyle =
    isValid || isValid === undefined
      ? "text-inherit peer-invalid/input:text-invalid peer-focus/input:text-focus"
      : "text-invalid"; //< Override default styling the invalid template.

  const whitespace = placeholder === undefined ? "" : `.${placeholder}.`; //< Using periods to make a slightly larger (transparent) placeholder to use as an background to the real placeholder.

  return (
    <div className="relative flex h-full w-full place-items-center border-inherit bg-inherit text-lg">
      <input
        className={`${inputConditionalStyle} peer/input h-full w-full rounded-md border-2 border-solid bg-inherit px-4 drop-shadow-md focus:outline-none disabled:border-focus disabled:text-focus`}
        type={type ?? "text"}
        pattern={pattern ?? ".*"} //< Determines the invalid (css) variant but not the isValid (js) state.
        onChange={onChange}
        disabled={isDisabled ?? false}
        value={value ?? ""}
        placeholder="" //< used to create the placeholder-shown (css) variant.
      />
      <div
        className={`pointer-events-none absolute top-0 -translate-y-1/2 translate-x-2 scale-y-[0.25] select-none bg-inherit px-1 text-sm font-bold text-transparent transition-all ease-in-out peer-placeholder-shown/input:top-1/2 peer-placeholder-shown/input:text-base peer-placeholder-shown/input:font-normal peer-focus/input:text-sm peer-placeholder-shown/input:peer-focus/input:top-0 peer-placeholder-shown/input:peer-focus/input:font-bold`}
      >
        {whitespace}
      </div>
      <div
        className={`${placeholderConditionalStyle} pointer-events-none absolute top-0 -translate-y-1/2 translate-x-4 select-none text-sm font-bold transition-all ease-in-out peer-placeholder-shown/input:top-1/2 peer-placeholder-shown/input:text-base peer-placeholder-shown/input:font-normal peer-focus/input:text-sm peer-placeholder-shown/input:peer-focus/input:top-0 peer-placeholder-shown/input:peer-focus/input:font-bold peer-disabled/input:text-focus peer-disabled/input:transition-none`}
      >
        {placeholder ?? ""}
      </div>
    </div>
  );
}
