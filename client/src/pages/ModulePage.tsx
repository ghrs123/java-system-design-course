import Navbar from "@/components/Navbar";
import { courseLevels } from "@/lib/courseData";
import { BookOpen, ChevronRight, FileText, FolderCode, Home, PenLine, Puzzle } from "lucide-react";
import { Link, useParams } from "wouter";

const COURSE_CONTENT_BASE = "/course-content";

export default function ModulePage() {
  const params = useParams<{ id: string; moduleSlug: string }>();
  const levelId = parseInt(params.id || "1", 10);
  const moduleSlug = params.moduleSlug || "";
  const level = courseLevels.find((l) => l.id === levelId);
  const topic = level?.topics.find((t) => t.moduleSlug === moduleSlug);

  if (!level || !topic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-mono text-2xl text-[var(--foreground)]">Módulo não encontrado</h1>
          <Link href="/" className="font-mono text-sm text-[var(--primary)]">Voltar ao curso</Link>
        </div>
      </div>
    );
  }

  const basePath = COURSE_CONTENT_BASE + "/" + topic.moduleBasePath;
  const isAmber = level.accentColor === "amber";
  const linkClass = isAmber
    ? "flex items-center gap-3 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 no-underline text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10"
    : "flex items-center gap-3 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 no-underline text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10";

  const sections = [
    { name: "README", file: "README.md", icon: FileText },
    { name: "Teoria", file: "theory.md", icon: BookOpen },
    { name: "Exercícios", file: "exercises.md", icon: PenLine },
    { name: "Soluções", file: "solutions.md", icon: Puzzle },
    { name: "Projeto", file: "project.md", icon: FolderCode },
    { name: "Código", path: "code/", icon: FolderCode },
  ] as const;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pb-10 pt-16">
        <div className="container mx-auto max-w-4xl px-4">
          <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-[var(--muted-foreground)]">
            <Link href="/" className="no-underline transition-colors hover:text-[var(--primary)]">Início</Link>
            <ChevronRight size={12} />
            <Link href={"/level/" + level.id} className="no-underline transition-colors hover:text-[var(--primary)]">Nível {String(level.id).padStart(2, "0")}</Link>
            <ChevronRight size={12} />
            <span className={isAmber ? "text-[var(--accent)]" : "text-[var(--primary)]"}>{topic.title}</span>
          </nav>
          <div className="mb-2 flex items-center gap-4">
            <div className={"flex h-12 w-12 items-center justify-center rounded-lg " + (isAmber ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-[var(--primary)]/20 text-[var(--primary)]")}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="font-mono text-2xl font-bold text-[var(--foreground)] sm:text-3xl">{topic.title}</h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{topic.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Conteúdo do módulo</h2>
          <div className="grid gap-3">
            {sections.map(({ name, file, path, icon: Icon }) => {
              const href = path ? basePath + "/" + path : basePath + "/" + file;
              return (
                <a key={name} href={href} className={linkClass} target="_blank" rel="noreferrer">
                  <Icon size={20} className={isAmber ? "text-[var(--accent)]" : "text-[var(--primary)]"} />
                  <span className="font-mono text-sm font-medium">{name}</span>
                  <span className="ml-auto text-xs text-[var(--muted-foreground)]">{path || file}</span>
                </a>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-[var(--muted-foreground)]">
            Os links abrem os ficheiros do repositório. O conteúdo é servido em <code className="rounded bg-[var(--muted)] px-1">/course-content/</code>.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--border)]/30 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <Link href={"/level/" + level.id} className="inline-flex items-center gap-2 font-mono text-sm text-[var(--muted-foreground)] no-underline transition-colors hover:text-[var(--primary)]">
            <Home size={16} />
            Voltar ao nível {level.id}
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)]/20 py-8">
        <div className="container text-center">
          <p className="font-mono text-xs text-[var(--muted-foreground)]">Java System Design Course — App standalone</p>
        </div>
      </footer>
    </div>
  );
}
