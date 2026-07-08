import React from 'react';

const WelcomeDashboard: React.FC = () => {
  return (
    <div className='mb-5 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 p-8 shadow-sm'>
      <div>
        <h1 className='mb-3 text-3xl font-bold text-gray-900'>Welcome to HawkStars Admin</h1>
        <p className='text-lg text-gray-600'>
          {`Manage your cultural organization's content, events, collections, and team members from
          this central dashboard. All changes are synchronized across both Portuguese and English
          versions of the website.`}
        </p>

        <div className='mt-6 flex flex-wrap items-center gap-8' data-project-stats>
          <h2 className='text-2xl font-bold text-gray-900'>Useful Links</h2>
          <div className='flex flex-col gap-1'>
            <a
              href='https://www.youtube.com/watch?v=0qDAn7jQOyc'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              Tutorial
            </a>
            <a
              href='https://6936ae02571a354f4f7c288f-lepszhgmbl.chromatic.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              Componentes Existentes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
