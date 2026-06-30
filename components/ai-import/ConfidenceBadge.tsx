type Level = "high" | "medium" | "low" | "unknown";

const STYLES: Record<Level, string> = {
  high:    "bg-emerald-50 text-emerald-700 border-emerald-100",
  medium:  "bg-amber-50 text-amber-700 border-amber-100",
  low:     "bg-orange-50 text-orange-700 border-orange-100",
  unknown: "bg-red-50 text-red-700 border-red-100",
};

const LABELS: Record<Level, string> = {
  high:    "high",
  medium:  "med",
  low:     "low",
  unknown: "missing",
};

export default function ConfidenceBadge({ level }: { level: string }) {
  const tier: Level = level in STYLES ? (level as Level) : "unknown";
  return (
    <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-medium border ${STYLES[tier]}`}>
      {LABELS[tier]}
    </span>
  );
}
