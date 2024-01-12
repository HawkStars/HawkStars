'use client';

import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contribution, Contributions } from '@/models/database';
import { Suspense, useCallback, useEffect, useState } from 'react';
import EditContributionSection from '../EditContributionSection/EditContributionSection';
import FormList from '../FormList/FormList';
import { ContributionWithConfirmed } from '../FormList/config';

const getAllContributions = async () => {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .select('*, profile:profiles(name)');

  if (error) return [];
  return data;
};

const DashboardFormList = () => {
  const [contributions, setContributions] = useState<ContributionWithConfirmed[]>([]);
  const [contributionToEdit, setContributionToEdit] = useState<Contribution | undefined>(undefined);

  const selectContributionToEdit = (contributionId: string) => {
    const contributionToEdit = contributions.find(
      (contribution) => contribution.id == contributionId
    );
    setContributionToEdit(contributionToEdit);
  };

  const initListContributions = useCallback(async () => {
    const data = await getAllContributions();
    setContributions(data);
  }, []);

  useEffect(() => {
    initListContributions();
  }, [initListContributions]);

  return (
    <>
      <Suspense fallback='loading'>
        <FormList
          contributions={contributions}
          selectContributionToEdit={selectContributionToEdit}
        />
      </Suspense>
      <div className='-mx-5 mt-10'>
        {contributionToEdit && (
          <EditContributionSection
            contributionToEdit={contributionToEdit}
            clearContribution={() => setContributionToEdit(undefined)}
          />
        )}
      </div>
    </>
  );
};

export default DashboardFormList;
