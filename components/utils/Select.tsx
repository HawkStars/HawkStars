import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import { useState } from 'react';
import { TfiAngleDown } from 'react-icons/tfi';

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
};

const Select = ({
  options,
  defaultOption,
  onChange,
  name,
  labelText,
}: SelectProps) => {
  const [selectedOption, setSelectedOption] = useState<
    SelectOption | undefined
  >(defaultOption);

  return (
    <div className='flex flex-col gap-2'>
      {labelText && <label>{labelText}</label>}
      <Listbox
        value={selectedOption}
        name={name}
        onChange={(e: SelectOption) => {
          setSelectedOption(e);
          onChange(e.value);
        }}
      >
        <div className='relative flex w-full'>
          <Listbox.Button className='flex w-full gap-3 bg-bege-light p-3'>
            <span>{selectedOption?.label || ''}</span>
            <div className='my-auto ml-auto'>
              <TfiAngleDown size={20} />
            </div>
          </Listbox.Button>
          <Listbox.Options className='absolute z-50 flex w-full flex-col gap-2 bg-bege-light p-3'>
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option}
                disabled={option.disabled}
                className={classNames({
                  'cursor-pointer': !option.disabled,
                  'opacity-50': option.disabled,
                })}
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
