import classNames from 'classnames';
import React from 'react';

interface TextAreaProps {
  onChange?: (e: any) => void;
  value?: string | number;
  customCss?: string;
  labelText?: string;
  name?: string;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  [x: string]: any;
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
  ...props
}: TextAreaProps) {
  return (
    <div className='flex flex-col gap-2'>
      {name && <label htmlFor={name}>{labelText}</label>}
      <textarea
        placeholder={placeholder}
        className={classNames(
          'border-terciary-500 focus:border-primary-500 block w-full rounded-md border border-solid px-5 py-2 shadow-sm focus:outline-none focus:ring-0',
          `${customCss}`,
          { 'border-red-700': errorMessage },
          { 'bg-gray-100': disabled }
        )}
        onChange={onChange}
        name={name}
        value={value}
        aria-labelledby={name}
        disabled={disabled}
        {...props}
      ></textarea>
      {errorMessage && <small className='text-red-700'>{errorMessage}</small>}
    </div>
  );
}
