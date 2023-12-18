type CheckboxProps = {
  checked: boolean;
  id: string;
  name: string;
  labelText: string;
  onChange: () => void;
};

const Checkbox = ({
  checked,
  id,
  name,
  labelText,
  onChange,
}: CheckboxProps) => {
  return (
    <div className='flex flex-row gap-3'>
      <input
        type='checkbox'
        checked={checked}
        id={id}
        name={name}
        onChange={onChange}
      />
      <label htmlFor={name}>{labelText}</label>
    </div>
  );
};

export default Checkbox;
