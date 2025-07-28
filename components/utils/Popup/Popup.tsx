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
      className={classNames('fixed inset-0 flex items-center justify-center bg-gray-500/50', {
        hidden: !isOpen,
      })}
      onClick={closePopup}
    >
      <div className='rounded-sm bg-white p-4 shadow-sm'>
        <h2 className='mb-4'>Popup Title</h2>
        <p className='mb-4'>Popup content goes here.</p>
        <div className='flex justify-end'>
          <button className='mr-2 rounded-sm bg-blue-500 px-4 py-2 text-white'>Accept</button>
          <button className='rounded-sm bg-red-500 px-4 py-2 text-white'>Discard</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
