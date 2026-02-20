interface TopicItem {
  id: string;
  title: string;
}

interface ProgressTrackerProps {
  topics: TopicItem[];
  activeIndex: number;
  accentColor: "cyan" | "amber";
}

export default function ProgressTracker({ topics, activeIndex, accentColor }: ProgressTrackerProps) {
  const dotColor = accentColor === "cyan" ? "bg-[var(--primary)]" : "bg-[var(--accent)]";
  const dotInactive = "bg-[var(--border)]";
  const lineActive = accentColor === "cyan" ? "bg-[var(--primary)]" : "bg-[var(--accent)]";
  const lineInactive = accentColor === "cyan" ? "bg-[var(--primary)]/30" : "bg-[var(--accent)]/30";
  return (
    <div className="sticky top-24 hidden flex-col items-center gap-0 lg:flex">
      {topics.map((topic, i) => (
        <div key={topic.id} className="flex flex-col items-center">
          <a href={"#topic-" + topic.id} className={"h-3 w-3 rounded-full transition-all duration-300 " + (i <= activeIndex ? dotColor : dotInactive) + (i === activeIndex ? " scale-125 ring-4 ring-[var(--primary)]/20" : "")} title={topic.title} />
          {i < topics.length - 1 && <div className={"h-16 w-0.5 transition-colors duration-300 " + (i < activeIndex ? lineActive : lineInactive)} />}
        </div>
      ))}
    </div>
  );
}
