type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  checked: boolean;
  id: string;
  name: string;
  labelText: string;
  onChangeHandle: (value: boolean) => void;
};

const Checkbox = ({ checked, id, name, labelText, onChangeHandle, ...props }: CheckboxProps) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeHandle(event.target.checked);
  };

  return (
    <div className='flex flex-row gap-3'>
      <input
        type='checkbox'
        checked={checked}
        id={id}
        name={name}
        onChange={handleOnChange}
        {...props}
      />
      <label className='' htmlFor={name}>
        {labelText}
      </label>
    </div>
  );
};

export default Checkbox;
