type BrandMarkProps = {
  small?: boolean;
  className?: string;
};

export function BrandMark({ small = false, className = "" }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex ${small ? "size-7 rounded-[0.65rem]" : "size-10 rounded-[0.9rem]"} items-center justify-center overflow-hidden bg-gradient-to-br from-[#4b5563] via-[#374151] to-[#212529] text-white shadow-[0_5px_12px_rgba(33,37,41,0.22)] ring-1 ring-[#6c757d]/20 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={small ? "size-[17px]" : "size-[21px]"}
      >
        <path
          d="M20.7 3.8 3.9 10.2c-.8.3-.8 1.4 0 1.7l6.5 2.2 2.2 6.3c.3.8 1.4.8 1.7 0l6.4-16.5c.2-.6-.3-1.1-.9-1.1Z"
          fill="currentColor"
        />
        <path
          d="m10.4 14.1 6.1-6.1"
          stroke="#d1d5db"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
