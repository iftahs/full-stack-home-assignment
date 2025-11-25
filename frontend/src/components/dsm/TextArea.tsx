import React from 'react';
import { BaseInput } from './BaseInput';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const TextArea = ({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  disabled,
  rows = 4,
  ...props
}: TextAreaProps) => {
  const inputId = id || props.name;

  return (
    <BaseInput
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      id={inputId}
    >
      <textarea
        id={inputId}
        rows={rows}
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
