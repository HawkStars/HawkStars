import classNames from 'classnames';
import React from 'react';

type PopupProps = {
  isOpen: boolean;
  closePopup: () => void;
  acceptFunction: () => void;
};

const Popup = ({ isOpen, closePopup, acceptFunction }: PopupProps) => {
  return (
    <div
      className={classNames(
        'bg-gray-500 fixed inset-0 flex items-center justify-center bg-opacity-50',
        {
          hidden: !isOpen,
        }
      )}
      onClick={closePopup}
    >
      <div className='rounded bg-white p-4 shadow'>
        <h2 className='mb-4'>Popup Title</h2>
        <p className='mb-4'>Popup content goes here.</p>
        <div className='flex justify-end'>
          <button className='bg-blue-500 mr-2 rounded px-4 py-2 text-white'>Accept</button>
          <button className='bg-red-500 rounded px-4 py-2 text-white'>Discard</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
