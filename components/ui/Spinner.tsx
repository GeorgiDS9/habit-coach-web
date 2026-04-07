interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export function Spinner({ size = "md", label = "Loading…" }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-gray-500" role="status">
      <span
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizeMap[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
