import React from "react";

interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  id?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  id = "",
  required = false,
  icon,
}) => {
  return (
    <div className="relative">
      <input
        id={id}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        autoCapitalize="none"
        autoFocus={false}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border border-[var(--input-border)] rounded-lg px-2 py-4 outline-none w-full ${className}`}
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
