type CheckboxProps = {
  checked: boolean;
  id: string;
  name: string;
  labelText: string;
  onChange: (value: boolean) => void;
};

const Checkbox = ({ checked, id, name, labelText, onChange }: CheckboxProps) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className='flex flex-row gap-3'>
      <input type='checkbox' checked={checked} id={id} name={name} onChange={handleOnChange} />
      <label className='text-sm' htmlFor={name}>
        {labelText}
      </label>
    </div>
  );
};

export default Checkbox;
