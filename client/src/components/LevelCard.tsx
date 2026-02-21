/*
 * ─── Blueprint Engineering Theme ───
 * LevelCard: Preview card for each level on the home page
 */

import type { Level } from "@/lib/courseData";
import { ArrowRight, BookOpen, Code2, Dumbbell } from "lucide-react";
import { Link } from "wouter";

interface LevelCardProps {
  level: Level;
  index: number;
}

const levelIcons = ["🔵", "🟡", "🔴", "🟣"];
const levelGradients = [
  "from-cyan-500/20 to-cyan-500/5",
  "from-cyan-500/20 to-amber-500/10",
  "from-amber-500/20 to-amber-500/5",
  "from-amber-500/20 to-primary/5",
];

export default function LevelCard({ level, index }: LevelCardProps) {
  const isAmber = level.accentColor === "amber";
  const totalExercises = level.topics.reduce(
    (acc, t) => acc + (t.exercises?.length || 0), 0
  );

  return (
    <div
      className="group card-blueprint rounded-lg overflow-hidden bg-card/40 backdrop-blur-sm"
      style={{
        animationDelay: `${index * 150}ms`,
        animation: "float-up 0.7s ease-out forwards",
        opacity: 0,
      }}
    >
      {/* Gradient header */}
      <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${levelGradients[index]}`}>
        {/* Blueprint grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${level.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${level.id})`} />
        </svg>

        <div className="absolute top-4 left-4">
          <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
            isAmber
              ? "bg-accent/20 text-accent border-accent/30"
              : "bg-primary/20 text-primary border-primary/30"
          }`}>
            NÍVEL {String(level.id).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <span className={`font-mono text-xs uppercase tracking-widest ${
            isAmber ? "text-accent/80" : "text-primary/80"
          }`}>
            {level.subtitle}
          </span>
          <div className="text-2xl mt-1">{levelIcons[index]}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-mono text-xl font-bold text-foreground mb-3">
          {level.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-3">
          {level.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
          <div className="flex items-center gap-1">
            <BookOpen size={12} />
            <span>{level.topics.length} tópicos</span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell size={12} />
            <span>{totalExercises} exercícios</span>
          </div>
          <div className="flex items-center gap-1">
            <Code2 size={12} />
            <span>{level.topics.reduce((a, t) => a + t.codeExamples.length, 0)} exemplos</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/level/${level.id}`}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded font-mono text-sm font-semibold transition-all no-underline ${
            isAmber
              ? "bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
              : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
          }`}
        >
          Explorar Nível
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
