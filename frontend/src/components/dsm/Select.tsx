import { useState, useRef, useEffect } from 'react';
import { BaseInput } from './BaseInput';
import { ChevronDownIcon } from '../../assets/icons/ChevronDownIcon';
import { CheckIcon } from '../../assets/icons/CheckIcon';

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  id?: string;
}

export const Select = ({
  label,
  value,
  onChange,
  options,
  disabled,
  className = '',
  helperText,
  error,
  required,
  placeholder = 'Select...',
  id,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <BaseInput
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      id={id}
    >
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full border rounded px-3 py-2 text-left flex justify-between items-center transition-colors outline-none ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : 'bg-white dark:bg-gray-700'} dark:text-white`}
        >
          <span className={`block truncate ${!selectedOption ? 'text-gray-500 dark:text-gray-400' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border dark:border-gray-700">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                  value === option.value ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                <span className="block truncate">{option.label}</span>
                {value === option.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseInput>
  );
};
