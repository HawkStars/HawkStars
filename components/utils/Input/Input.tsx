import classNames from 'classnames';
import React from 'react';

interface InputProps {
  onChange?: (e: any) => void;
  value?: string | number;
  customCss?: string;
  labelText?: string;
  name: string;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  outline?: boolean;
  icon?: React.ReactNode;
  [x: string]: any;
}

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
  ...props
}: InputProps) {
  return (
    <div className='flex flex-col gap-2'>
      {name && <label htmlFor={name}>{labelText}</label>}
      <div
        className={classNames(
          'border-terciary-500 focus:border-primary-500 flex flex-row gap-1 rounded-md border border-solid px-5 py-2 shadow-sm',
          { 'bg-bege-dark-100 bg-opacity-80': disabled },
          { 'bg-white': !disabled && outline }
        )}
      >
        <input
          placeholder={placeholder}
          className={classNames(
            ' w-full border-0 bg-inherit focus:outline-none focus:ring-0',
            `${customCss}`,
            { 'border-red-700': errorMessage },
            { 'bg-bege-dark-100 bg-opacity-80': disabled },
            { 'text-right': icon }
          )}
          onChange={onChange}
          name={name}
          value={value}
          aria-labelledby={name}
          disabled={disabled}
          {...props}
        />
        {icon && <span className='my-auto ml-auto'>{icon}</span>}
      </div>
      {errorMessage && <small className='text-red-700'>{errorMessage}</small>}
    </div>
  );
}
