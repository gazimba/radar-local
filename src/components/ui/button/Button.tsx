export function Button({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`h-11 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${className}`}
            {...rest}
        >
            {children}
        </button>
    )
}