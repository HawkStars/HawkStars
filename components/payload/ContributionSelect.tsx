'use client';

import type { SelectFieldClientComponent } from 'payload';

import {
  priceOfContribution,
  ContributionSelectOption,
  contributionTypeOptions,
} from '@/payload/collections/Contribution/config';
import { useField, SelectField } from '@payloadcms/ui';

const ContributionSelect: SelectFieldClientComponent = ({ field, path }) => {
  const { value: selectValue, setValue: setSelectValue } = useField<ContributionSelectOption>({
    path: 'contribution_type',
  });

  const { setValue: setTargetValue } = useField({
    path: 'value',
  });

  const handleSelectChange = (newValue: string | string[]) => {
    const selectedOption = contributionTypeOptions.find((option) => option.value === newValue);
    if (!selectedOption) return;
    setSelectValue(selectedOption);

    const contributionValue = priceOfContribution[newValue as keyof typeof priceOfContribution];
    if (contributionValue) setTargetValue(contributionValue);
  };

  return (
    <SelectField
      field={field}
      value={selectValue?.value || ''}
      onChange={(e) => handleSelectChange(e)}
      path={path}
    />
  );
};

export default ContributionSelect;
