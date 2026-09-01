'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ListFilterOption = {
  value: string;
  label: string;
};

export type ListFilterConfig = {
  // The URL search param this filter reads/writes, e.g. "type" or "year".
  param: string;
  // Doubles as the placeholder text and the "clear this filter" option, e.g. "All Types".
  allLabel: string;
  // The filter's current value, if any is selected -- undefined means "All".
  value?: string;
  options: ListFilterOption[];
};

type ListFiltersProps = {
  filters: ListFilterConfig[];
};

// Sentinel for "no filter selected" -- Radix's <Select.Item> can't take an
// empty-string value (it's reserved internally for clearing), so this stands
// in for it and gets stripped back out of the URL on selection.
const ALL_VALUE = 'all';

// Server-rendered list pages (projects/events/news, and their archives) pass
// down plain, serializable filter configs -- this is the one client
// component in that chain, since reading/writing the URL's query string
// needs next/navigation's client hooks.
const ListFilters = ({ filters }: ListFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_VALUE) {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    // Changing a filter invalidates whatever page a paginated list was on --
    // reset every pagination param back to page 1 rather than risk landing
    // on, say, page 3 of a filtered list that only has one page.
    params.delete('page');
    params.delete('upcomingPage');
    params.delete('pastPage');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  if (filters.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-3'>
      {filters.map((filter) => (
        <Select
          key={filter.param}
          value={filter.value ?? ALL_VALUE}
          onValueChange={(value) => handleChange(filter.param, value)}
        >
          <SelectTrigger aria-label={filter.allLabel} className='w-[180px]'>
            <SelectValue placeholder={filter.allLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{filter.allLabel}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
};

export default ListFilters;
