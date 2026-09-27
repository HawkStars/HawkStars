import { ComponentProps, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

const controlClass =
  'border-art-line bg-art-ebony font-art-sans text-art-text placeholder:text-art-muted focus:border-art-gold-bright aria-invalid:border-art-terracotta w-full border px-4 py-3 text-sm outline-none transition-colors';

/** Bottom-border-only look used by the artist proposal form. */
const underlineClass = 'border-0 border-b bg-transparent px-0 text-base';

type FieldShellProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: (ids: { id: string; describedBy?: string }) => ReactNode;
};

/**
 * Label + control + error for the gallery's dark forms. The shared
 * `components/utils/Input` is styled for the light org theme only.
 */
function FieldShell({ label, error, hint, className, children }: FieldShellProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className='art-eyebrow text-art-text-2'>
        {label}
      </label>
      {children({ id, describedBy })}
      {hint && (
        <p id={hintId} className='text-art-muted text-xs'>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role='alert' className='text-art-terracotta text-xs'>
          {error}
        </p>
      )}
    </div>
  );
}

type SharedProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  wrapperClassName?: string;
  underline?: boolean;
};

export function ArtInput({
  label,
  error,
  hint,
  wrapperClassName,
  underline,
  className,
  ...props
}: SharedProps & ComponentProps<'input'>) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={wrapperClassName}>
      {({ id, describedBy }) => (
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(controlClass, underline && underlineClass, className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function ArtTextArea({
  label,
  error,
  hint,
  wrapperClassName,
  underline,
  className,
  ...props
}: SharedProps & ComponentProps<'textarea'>) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={wrapperClassName}>
      {({ id, describedBy }) => (
        <textarea
          id={id}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(controlClass, underline && underlineClass, 'resize-y', className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function ArtSelect({
  label,
  error,
  hint,
  wrapperClassName,
  underline,
  className,
  children,
  ...props
}: SharedProps & ComponentProps<'select'>) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={wrapperClassName}>
      {({ id, describedBy }) => (
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            controlClass,
            underline && underlineClass,
            '[&>option]:bg-art-ebony appearance-none',
            className
          )}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
