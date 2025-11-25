import React from 'react';

export interface BaseInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  id?: string;
}

export const BaseInput = ({
  label,
  helperText,
  error,
  required,
  children,
  id,
}: BaseInputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || helperText) && (
        <p className={`text-sm mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
