import { useState, useEffect } from 'react';

interface ValidationRules {
    [key: string]: (value: any) => boolean;
}

interface ValidationErrors {
    [key: string]: boolean;
}

export const useFormValidation = (formData: any, rules: ValidationRules) => {
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
        const newErrors: ValidationErrors = {};
        
        Object.keys(rules).forEach(field => {
            const isValidField = rules[field](formData[field]);
            if (!isValidField) {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    }, [formData, rules]);

    return { errors, isValid };
};