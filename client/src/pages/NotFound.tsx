import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--background)]">
      <div className="mx-4 max-w-lg rounded-lg border border-[var(--border)] bg-[var(--card)]/80 p-8 text-center backdrop-blur-sm">
        <AlertCircle className="mx-auto mb-6 h-16 w-16 text-red-500" />
        <h1 className="mb-2 font-mono text-4xl font-bold text-[var(--foreground)]">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-[var(--muted-foreground)]">Página não encontrada</h2>
        <p className="mb-8 leading-relaxed text-[var(--muted-foreground)]">A página que procura não existe ou foi movida.</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-2.5 font-mono text-sm text-[var(--primary-foreground)] no-underline hover:opacity-90">
          <Home size={16} />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
