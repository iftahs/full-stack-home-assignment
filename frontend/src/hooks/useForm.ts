import { useState } from 'react';

interface FieldConfig {
    name: string;
    disabled?: boolean;
    helperText?: string;
    isRequired?: boolean;
    validationMessage?: string;
    initialValue?: string;
}

interface FieldResult {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    disabled?: boolean;
    helperText?: string;
    isRequired?: boolean;
    validationError?: string;
}

export const useForm = <T extends Record<string, any>>(initialFields: Record<keyof T, FieldConfig>) => {
    const [values, setValues] = useState<T>(() => {
        const initial = {} as T;
        (Object.keys(initialFields) as Array<keyof T>).forEach(key => {
            initial[key] = (initialFields[key].initialValue || '') as T[keyof T];
        });
        return initial;
    });

    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleChange = (key: keyof T, value: string) => {
        setValues(prev => ({ ...prev, [key]: value as T[keyof T] }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof T, string>> = {};
        let isValid = true;

        (Object.keys(initialFields) as Array<keyof T>).forEach(key => {
            const field = initialFields[key];
            if (field.isRequired && !values[key]) {
                newErrors[key] = field.validationMessage || 'This field is required';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const formData = {} as Record<keyof T, FieldResult>;
    (Object.keys(initialFields) as Array<keyof T>).forEach(key => {
        const field = initialFields[key];
        formData[key] = {
            name: field.name,
            value: String(values[key] || ''),
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleChange(key, e.target.value),
            disabled: field.disabled,
            helperText: field.helperText,
            isRequired: field.isRequired,
            validationError: errors[key],
        };
    });

    return { formData, validate, values, setValues };
};