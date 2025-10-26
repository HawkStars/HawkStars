import classNames from 'classnames';
import React from 'react';

export type InputProps = {
  name: string;
  onChange?: (e: any) => void;
  value?: string | number | null;
  customCss?: string;
  labelText?: string;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  outline?: boolean;
  icon?: React.ReactNode;
  inputHintText?: string;
  [x: string]: any;
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
  return (
    <div className='flex flex-col gap-2'>
      {labelText && (
        <label className='text-body_semibold' htmlFor={name}>
          {labelText}
        </label>
      )}
      {inputHintText && <p className='-my-1'>{inputHintText}</p>}
      <div
        className={classNames(
          'border-terciary-500 focus:border-primary-500 flex flex-row gap-1 rounded-md border border-solid px-5 py-2 shadow-xs',
          { 'bg-bege-dark-100/80': disabled },
          { 'bg-white': !disabled && outline }
        )}
      >
        <input
          id={name}
          placeholder={placeholder}
          className={classNames(
            'w-full border-0 bg-inherit focus:ring-0 focus:outline-hidden',
            `${customCss}`,
            { 'border-red-700': errorMessage },
            { 'bg-bege-dark-100/80': disabled },
            { 'text-right': icon }
          )}
          onChange={onChange}
          name={name}
          value={value || ''}
          aria-labelledby={name}
          disabled={disabled}
          aria-label={name}
          {...props}
        />
        {icon && <span className='my-auto ml-auto'>{icon}</span>}
      </div>
      {errorMessage && <small className='text-red-700'>{errorMessage}</small>}
    </div>
  );
}
