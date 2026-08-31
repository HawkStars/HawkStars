import { FC } from 'react';

type ListFiltersProps = {
  onHandleSelect: (value: string) => void;
};

const ListFilters: FC<ListFiltersProps> = (props) => {
  const { onHandleSelect } = props;
  return <div className='flex gap-2'></div>;
};

export default ListFilters;
