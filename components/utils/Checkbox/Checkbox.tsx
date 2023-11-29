type CheckboxProps = {
  checked: boolean;
  id: string;
  name: string;
  labelText: string;
};

const Checkbox = ({ checked, id, name, labelText }: CheckboxProps) => {
  return (
    <div className='flex flex-row gap-3'>
      <input type='checkbox' checked={checked} id={id} name={name} />
      <label htmlFor={name}>{labelText}</label>
    </div>
  );
};

export default Checkbox;
