export type FormState = {
    status?: "success" | "error";
    message?: string;
} | null;

export function FormResposta({ state }: { state: FormState }) {
    if (!state) return null;

    if (state.status === "success") {
        return (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {state.message}
            </div>
        );
    }

    if (state.status === "error") {
        return (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {state.message}
            </div>
        );
    }

    return null;
}