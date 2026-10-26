type BrandMarkProps = {
  small?: boolean;
  className?: string;
};

export function BrandMark({ small = false, className = "" }: BrandMarkProps) {
  return (
    <span
      className={`flex ${small ? "size-7 rounded-lg" : "size-9 rounded-xl"} items-center justify-center bg-[#24243d] text-white shadow-sm ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={small ? "size-4" : "size-5"}
        aria-hidden="true"
      >
        <path
          d="M5 17.5 9.3 6.5h2.2l4.1 11h-2.4l-.9-2.6H8.2l-1 2.6H5Z"
          fill="currentColor"
        />
        <path d="M15 6.5h4v2h-4z" fill="#a5b4fc" />
      </svg>
    </span>
  );
}
