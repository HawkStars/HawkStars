import { cn } from '@/lib/utils';
import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  labelText?: string;
  errorMessage?: string;
  customCss?: string;
  outline?: boolean;
  icon?: React.ReactNode;
  inputHintText?: string;
};

export default function Input({
  onChange,
  value,
  name = '',
  labelText = '',
  customCss = '',
  errorMessage = '',
  placeholder = '',
  disabled = false,
  icon = undefined,
  outline = false,
  inputHintText = '',
  ...props
}: InputProps) {
  // A11Y: the accessible name comes from the real <label htmlFor={name}> below.
  // Do NOT add aria-label/aria-labelledby here — aria-labelledby={name} used to
  // point at this input's own id, and aria-label={name} overrode the translated
  // label with the raw field name (e.g. "submitter_email"). See AUDIT.md A11Y-H1.
  const hintId = inputHintText ? `${name}-hint` : undefined;
  const errorId = errorMessage ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className='flex flex-col gap-2'>
      {labelText && (
        <label className='text-body_semibold' htmlFor={name}>
          {labelText}
        </label>
      )}
      {inputHintText && (
        <p id={hintId} className='-my-1'>
          {inputHintText}
        </p>
      )}
      <div
        className={cn(
          'border-b-bege-dark focus-within:ring-ring flex h-10 w-full flex-row items-center gap-1 border-b-2 px-3 py-2 focus-within:ring-2 focus-within:ring-offset-2',
          { 'cursor-not-allowed opacity-50': disabled },
          { 'bg-white': !disabled && outline },
          { 'border-b-red-dark': errorMessage }
        )}
      >
        <input
          id={name}
          placeholder={placeholder}
          className={cn(
            'w-full border-0 bg-inherit focus:ring-0 focus:outline-hidden',
            `${customCss}`,
            { 'text-right': icon }
          )}
          onChange={onChange}
          name={name}
          value={value || ''}
          disabled={disabled}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        {icon && <span className='my-auto ml-auto'>{icon}</span>}
      </div>
      {errorMessage && (
        <small id={errorId} role='alert' className='text-red-dark'>
          {errorMessage}
        </small>
      )}
    </div>
  );
}
