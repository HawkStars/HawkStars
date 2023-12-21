'use client';

import FormContributions from '@/components/superadmin/FormContributions/FormContributions';
import FormOrganizationMovement from '@/components/superadmin/FormOrganizationMovements/FormOrganizationMovements';
import classNames from 'classnames';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type SuperAdminSections =
  | 'dashboard'
  | 'form'
  | 'add_contribution'
  | 'add_organization_movement';

const SuperAdminPage = () => {
  const [section, setSection] = useState<SuperAdminSections>('dashboard');
  return (
    <>
      <section className='mt-10 flex flex-col gap-10'>
        <div className='flex flex-row justify-center gap-4'>
          <div
            className={classNames({
              'text-bege-dark underline': section == 'dashboard',
            })}
            onClick={() => setSection('dashboard')}
          >
            Dashboard
          </div>
          <div
            className={classNames({
              'text-bege-dark underline': section == 'form',
            })}
            onClick={() => setSection('form')}
          >
            Form
          </div>
          <div
            className={classNames({
              'text-bege-dark underline': section == 'add_contribution',
            })}
            onClick={() => setSection('add_contribution')}
          >
            Add Contribution Manually
          </div>
          <div
            className={classNames({
              'text-bege-dark underline':
                section == 'add_organization_movement',
            })}
            onClick={() => setSection('add_organization_movement')}
          >
            Add Organization Movement
          </div>
        </div>

        {section == 'dashboard' && <div>Dashboard</div>}
        {section == 'form' && <div>Form</div>}
        {section == 'add_organization_movement' && (
          <section>
            <h3 className='text-center'>Movimentos Organização</h3>
            <FormOrganizationMovement formType={'create'} />
          </section>
        )}
        {section == 'add_contribution' && (
          <section className='flex flex-col gap-3'>
            <h3 className='text-center'>Contributions</h3>
            <FormContributions formType='create' />
          </section>
        )}
      </section>
      <ToastContainer />
    </>
  );
};

export default SuperAdminPage;
