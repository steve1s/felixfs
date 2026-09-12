import Link from "next/link";

export function ProduceChip({
  name,
  peak = false,
  size = "md",
}: {
  name: string;
  peak?: boolean;
  size?: "sm" | "md";
}) {
  const href = `/recipes?ingredient=${encodeURIComponent(name)}`;
  const peakClass = peak
    ? "bg-emerald-600 text-white hover:bg-emerald-700"
    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <Link
      href={href}
      className={`rounded-full font-medium transition ${peakClass} ${sizeClass}`}
      title={`See recipes using ${name}`}
    >
      {name}
    </Link>
  );
}
