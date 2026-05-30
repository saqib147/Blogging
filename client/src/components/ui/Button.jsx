const variants = {
  primary: 'bg-primary text-primary-text hover:bg-primary-hover shadow-sm hover:shadow-md',
  secondary: 'bg-secondary text-secondary-text hover:bg-secondary-hover shadow-sm',
  ghost: 'bg-transparent text-primary hover:bg-primary/6 border border-primary/15',
  outline: 'bg-surface/80 border border-neutral-body/15 hover:border-primary/30 text-neutral-heading hover:bg-primary/3',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
