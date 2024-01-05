'use client';

import Dashboard from '@/components/superadmin/Dashboard/Dashboard';
import FormContributions, {
  ContributionFormInput,
} from '@/components/superadmin/FormContributions/FormContributions';
import { addOrganizationContribution } from '@/components/superadmin/FormContributions/service';
import FormOrganizationMovement from '@/components/superadmin/FormOrganizationMovements/FormOrganizationMovements';
import SuperAdminTabItem from '@/components/superadmin/SuperAdminTabItem/SuperAdminTabItem';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type SuperAdminSection =
  | 'dashboard'
  | 'add_contribution'
  | 'add_organization_movement';

const SuperAdminPage = () => {
  const [currentSection, setCurrentSection] =
    useState<SuperAdminSection>('dashboard');

  const handleSubmitForm = async (data: ContributionFormInput) => {
    return await addOrganizationContribution(data);
  };

  return (
    <>
      <section className='mt-10 flex flex-col gap-5'>
        <div className='mb-5 flex flex-row justify-center gap-4 border-b border-bege-dark py-2'>
          <SuperAdminTabItem
            section='dashboard'
            currentSectionSelected={currentSection}
            onClick={() => setCurrentSection('dashboard')}
            tabText='Dashboard'
          />
          <SuperAdminTabItem
            section='add_contribution'
            currentSectionSelected={currentSection}
            onClick={() => setCurrentSection('add_contribution')}
            tabText='Add Contribution'
          />
          <SuperAdminTabItem
            section='add_organization_movement'
            currentSectionSelected={currentSection}
            onClick={() => setCurrentSection('add_organization_movement')}
            tabText='Add Organization Movement'
          />
        </div>

        {currentSection == 'dashboard' && <Dashboard />}
        {currentSection == 'add_organization_movement' && (
          <section>
            <h3 className='text-center'>Movimentos Organização</h3>
            <FormOrganizationMovement formType={'create'} />
          </section>
        )}
        {currentSection == 'add_contribution' && (
          <section className='flex flex-col gap-3'>
            <h3 className='text-center'>Contributions</h3>
            <FormContributions formType='create' onSubmit={handleSubmitForm} />
          </section>
        )}
      </section>
      <ToastContainer />
    </>
  );
};

export default SuperAdminPage;
