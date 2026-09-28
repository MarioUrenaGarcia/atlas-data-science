/** Small graph mark: three connected nodes, echoing the prerequisite map. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7" fill="var(--color-accent)" />
      <path d="M9 22 16 11 24 19" stroke="var(--color-on-accent)" strokeWidth="1.8" fill="none" />
      <circle cx="9" cy="22" r="3" fill="var(--color-on-accent)" />
      <circle cx="16" cy="11" r="3" fill="var(--color-on-accent)" />
      <circle cx="24" cy="19" r="3" fill="var(--color-on-accent)" />
    </svg>
  );
}
