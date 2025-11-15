import React from "react";
import { InputProps } from "@/types/shared";

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  id = "",
  required = false,
  icon,
  name,
  autoComplete = "off",
  onBlur,
}) => {
  return (
    <div className="relative">
      <input
        id={id}
        autoComplete={autoComplete}
        autoCorrect="off"
        spellCheck="false"
        autoCapitalize="none"
        autoFocus={false}
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`border border-[var(--input-border)] rounded-lg px-2 py-4 outline-none w-full bg-white ${className} text-[var(--text-gray-tertiary)] placeholder:text-[var(--text-gray-tertiary)]`}
      />
      {icon && (
        <div className="absolute top-4 right-2 flex items-center justify-center">
          {icon}
        </div>
      )}
    </div>
  );
};

export default Input;
