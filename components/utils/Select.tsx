import { Listbox, ListboxButton, ListboxOption } from '@headlessui/react';
import classNames from 'classnames';
import { useState } from 'react';
import Image from 'next/image';
import CaretDown from '@/public/images/icons/common/caret-down.svg';

export type SelectOption = {
  label: string;
  value: string;
  id: string;
  disabled: boolean;
};

type SelectProps = {
  options: SelectOption[];
  defaultOption?: SelectOption;
  onChange: (e: unknown) => void;
  name: string;
  labelText?: string;
  outline?: boolean;
};

const Select = ({
  options,
  defaultOption,
  onChange,
  name,
  labelText,
  outline = false,
}: SelectProps) => {
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(defaultOption);

  return (
    <div className='flex flex-col gap-2'>
      {labelText && <span className='text-body_semibold'>{labelText}</span>}
      <Listbox
        value={selectedOption}
        name={name}
        onChange={(e: SelectOption) => {
          setSelectedOption(e);
          onChange(e.value);
        }}
      >
        <div className='relative flex w-full'>
          <ListboxButton
            className={classNames('flex w-full gap-3 rounded-xl border p-3', {
              'bg-bege-light': !outline,
              'bg-white': outline,
            })}
          >
            <span>{selectedOption?.label || ''}</span>
            <div className='my-auto ml-auto'>
              <Image src={CaretDown} alt='Caret Down' width={20} height={20} />
            </div>
          </ListboxButton>
          {options.map((option) => (
            <ListboxOption
              key={option.id}
              value={option}
              disabled={option.disabled}
              className={classNames({
                'cursor-pointer': !option.disabled,
                'opacity-50': option.disabled,
              })}
            >
              {option.label}
            </ListboxOption>
          ))}
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
