import { cn } from "../../../utils/utils";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: "default" | "form" | "success" | "error" | "disabled";
}

export function TextArea({ className, variant = "default", ...rest }: TextAreaProps) {
    const baseStyles = "h-11 w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-3 bg-blue-200/10 text-blue-900";
    const variants = {
        default: "border-blue-600 focus:border-blue-500 focus:ring-blue-500/20",
        form: "border-blue-600 focus:border-blue-300 focus:ring-blue-500/20",
        success: "border-emerald-500 focus:border-emerald-300 focus:ring-emerald-500/20",
        error: "border-red-500 focus:border-red-300 focus:ring-red-500/20",
        disabled: "opacity-50 bg-gray-100 cursor-not-allowed",
    };
    return (
        <textarea
            className={cn(
                baseStyles,
                variants[variant],
                className
            )}
            disabled={variant === "disabled"}
            {...rest}
        />

    )
}