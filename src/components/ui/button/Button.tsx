import { cn } from "../../../utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "form" | "success" | "error" | "disabled" | "outline";
}

export function Button({ className, variant = "default", ...rest }: ButtonProps) {
    const baseStyles = "h-11 px-4 py-2 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        default: "bg-orange-400 hover:bg-orange-500",
        form: "bg-blue-500 hover:bg-blue-700",
        success: "bg-green-500 hover:bg-green-700",
        error: "bg-red-500 hover:bg-red-700",
        disabled: "bg-gray-500 cursor-not-allowed",
        outline: "bg-transparent border border-white hover:bg-white hover:text-gray-800"
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                className
            )}
            disabled={variant === "disabled"}
            {...rest}
        >
            {rest.children}
        </button>
    )
}