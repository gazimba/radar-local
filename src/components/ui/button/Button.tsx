export function Button({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`h-11 px-4 py-2 rounded-lg bg-orange-400 text-white font-medium hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${className}`}
            {...rest}
        >
            {children}
        </button>
    )
}