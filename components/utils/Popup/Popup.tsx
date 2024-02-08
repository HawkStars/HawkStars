import React from 'react';

type PopupProps = {
  isOpen: boolean;
};

const Popup = ({ isOpen }: PopupProps) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'>
      <div className='rounded bg-white p-4 shadow'>
        <h2 className='mb-4 text-xl font-bold'>Popup Title</h2>
        <p className='mb-4'>Popup content goes here.</p>
        <div className='flex justify-end'>
          <button className='mr-2 rounded bg-blue-500 px-4 py-2 text-white'>Accept</button>
          <button className='rounded bg-red-500 px-4 py-2 text-white'>Discard</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
