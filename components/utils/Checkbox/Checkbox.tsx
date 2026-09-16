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
      {/* htmlFor must match the input's `id`, not its `name`. It used to be
          `htmlFor={name}`, and at the donation form's call site `name` was
          "donor" — the id of the donor *text* input — so clicking this
          checkbox's label focused a different (and sometimes disabled) field. */}
      <label htmlFor={id}>{labelText}</label>
    </div>
  );
};

export default Checkbox;
