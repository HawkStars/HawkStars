import React from 'react';

const WelcomeDashboard: React.FC = () => {
  return (
    <div className='mb-5 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 p-8 shadow-sm'>
      <div>
        <h1 className='mb-3 text-3xl font-bold text-gray-900'>Welcome to HawkStars Admin</h1>
        <p className='text-lg text-gray-600'>
          Manage your cultural organization's content, events, collections, and team members from
          this central dashboard. All changes are synchronized across both Portuguese and English
          versions of the website.
        </p>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
