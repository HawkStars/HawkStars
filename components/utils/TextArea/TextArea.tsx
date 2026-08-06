import { cn } from '@/lib/utils';
import React from 'react';

interface TextAreaProps {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string | number;
  customCss?: string;
  labelText?: string;
  name?: string;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  inputHintText?: string;
  [x: string]: unknown;
}

export default function TextArea({
  onChange,
  value,
  name = '',
  labelText = '',
  customCss = '',
  errorMessage = '',
  placeholder = '',
  disabled = false,
  inputHintText = '',
  ...props
}: TextAreaProps) {
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
      <textarea
        id={name}
        placeholder={placeholder}
        className={cn(
          'border-terciary-500 focus-visible:border-primary-500 focus-visible:ring-primary-500 block w-full rounded-md border border-solid px-5 py-2 shadow-xs focus:ring-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2',
          `${customCss}`,
          { 'border-red-700': errorMessage },
          { 'bg-gray-100': disabled }
        )}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      ></textarea>
      {errorMessage && (
        <small id={errorId} role='alert' className='text-red-700'>
          {errorMessage}
        </small>
      )}
    </div>
  );
}
