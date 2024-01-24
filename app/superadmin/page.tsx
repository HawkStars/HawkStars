'use client';

import Dashboard from '@/components/superadmin/Dashboard/Dashboard';
import FormContributionSection from '@/components/superadmin/FormContributionsSection/FormContributionSection';
import FormOrganizationMovement from '@/components/superadmin/FormOrganizationMovements/FormOrganizationMovements';
import SuperAdminTabItem from '@/components/superadmin/SuperAdminTabItem/SuperAdminTabItem';
import Head from 'next/head';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SuperAdminSection, superAdminSections } from './config';

const SuperAdminPage = () => {
  const [currentSection, setCurrentSection] = useState<SuperAdminSection>('dashboard');

  return (
    <>
      <Head>
        <title>Superadmin</title>
      </Head>
      <section className='mt-10 flex flex-col gap-5'>
        <div className='mb-5 flex flex-row justify-center gap-4 border-b-2 border-bege-dark py-2'>
          {superAdminSections.map(({ label, section }, index) => (
            <SuperAdminTabItem
              key={index}
              section={section}
              onClick={() => setCurrentSection(section)}
              tabText={label}
              currentSectionSelected={currentSection}
            />
          ))}
        </div>

        {currentSection == 'dashboard' && <Dashboard />}
        {currentSection == 'add_organization_movement' && (
          <section>
            <h3 className='text-center'>Movimentos Organização</h3>
            <FormOrganizationMovement formType={'create'} />
          </section>
        )}
        {currentSection == 'add_contribution' && <FormContributionSection />}
        {currentSection == 'erasmus' && <div className='text-center font-black'>A implementar</div>}
        {currentSection == 'events' && <div className='text-center font-black'>A implementar</div>}
        {currentSection == 'settings' && (
          <div className='text-center font-black'>A implementar</div>
        )}
      </section>
      <ToastContainer />
    </>
  );
};

export default SuperAdminPage;
