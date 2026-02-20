import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
          <div className="flex w-full max-w-2xl flex-col items-center p-8">
            <AlertTriangle size={48} className="mb-6 shrink-0 text-red-500" />
            <h2 className="mb-4 text-xl text-[var(--foreground)]">Ocorreu um erro inesperado.</h2>
            <div className="mb-6 w-full overflow-auto rounded bg-[var(--muted)] p-4">
              <pre className="whitespace-break-spaces text-sm text-[var(--muted-foreground)]">
                {this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)] hover:opacity-90"
              )}
            >
              <RotateCcw size={16} />
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
