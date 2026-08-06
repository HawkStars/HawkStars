import { cn } from '@/lib/utils';
import React from 'react';

export type InputProps = {
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | null;
  customCss?: string;
  labelText?: string;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  outline?: boolean;
  icon?: React.ReactNode;
  inputHintText?: string;
  [x: string]: unknown;
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
          'border-terciary-500 focus-within:border-primary-500 focus-within:ring-primary-500 flex flex-row gap-1 rounded-md border border-solid px-5 py-2 shadow-xs focus-within:ring-2 focus-within:ring-offset-2',
          { 'bg-bege-dark-100/80': disabled },
          { 'bg-white': !disabled && outline },
          { 'border-red-700': errorMessage }
        )}
      >
        <input
          id={name}
          placeholder={placeholder}
          className={cn(
            'w-full border-0 bg-inherit focus:ring-0 focus:outline-hidden',
            `${customCss}`,
            { 'bg-bege-dark-100/80': disabled },
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
        <small id={errorId} role='alert' className='text-red-700'>
          {errorMessage}
        </small>
      )}
    </div>
  );
}
