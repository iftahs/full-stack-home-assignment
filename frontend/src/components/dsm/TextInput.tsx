import React from 'react';
import { BaseInput } from './BaseInput';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const TextInput = ({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  disabled,
  ...props
}: TextInputProps) => {
  const inputId = id || props.name;

  return (
    <BaseInput
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      id={inputId}
    >
      <input
        id={inputId}
        disabled={disabled}
        className={`w-full border rounded px-3 py-2 outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`}
        {...props}
      />
    </BaseInput>
  );
};
