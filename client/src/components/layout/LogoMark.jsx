/** Ink & Echo mark — fountain pen nib with echo ripples */
export default function LogoMark({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden>
      <path d="M18 4.5v10" stroke="var(--logo-nib)" strokeWidth="2.75" strokeLinecap="round" />
      <path d="M11.5 14.5h13L18 28.5 11.5 14.5z" fill="var(--logo-nib)" />
      <path d="M18 14.5v14" stroke="var(--logo-slit)" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="18" cy="29.5" r="1.75" fill="var(--logo-ripple-1)" />
      <path
        d="M22.5 21.5c3.5 0 5-1.8 5-4.2"
        stroke="var(--logo-ripple-1)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22.5 25c4.8 0 7-2.2 7-5.5"
        stroke="var(--logo-ripple-2)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M22.5 28.5c6 0 9-2.8 9-7"
        stroke="var(--logo-ripple-1)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
