import React from 'react';
import { BaseInput } from './BaseInput';

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: Option[];
}

export const Select = ({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  disabled,
  options,
  ...props
}: SelectProps) => {
  const inputId = id || props.name;

  return (
    <BaseInput
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      id={inputId}
    >
      <select
        id={inputId}
        disabled={disabled}
        className={`w-full border rounded px-3 py-2 outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </BaseInput>
  );
};
