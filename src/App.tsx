import { Routes } from "./routes";
import { CidadeProvider } from "./context/CidadeContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./components/ui/ConfirmDialog";

export function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <CidadeProvider>
          <Routes />
        </CidadeProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
