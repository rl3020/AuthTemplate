interface ArrowRightProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ArrowRight({
  size = 16,
  strokeWidth = 1.75,
  className,
}: ArrowRightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
