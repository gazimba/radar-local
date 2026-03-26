interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    type?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
}

export function Input({ placeholder, value, onChange, name, type, className, disabled, error, success, ...rest }: InputProps) {
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 ${className}`;
    if (disabled) {
        inputClasses += `text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed opacity-40`;
    } else if (error) {
        inputClasses += `border-error-500 focus:border-error-300 focus:ring-error-500/20`;
    } else if (success) {
        inputClasses += `border-success-500 focus:border-success-300 focus:ring-success-500/20`;
    } else {
        inputClasses += `bg-transparent text-gray-100 border-blue-900 focus:border-blue-300 focus:ring-blue-500/20 bg-blue-700 focus:bg-blue-700/90`;
    }
    return (
        <input
            type={type || "text"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            className={className || inputClasses}
            {...rest}
        />
    )
}