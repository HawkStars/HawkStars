'use client';

import { CldUploadButton, CldUploadWidget } from 'next-cloudinary';
import React, { useState } from 'react';

export type CloudinaryUploaderSuccessResponse = { success: true; data: unknown };
export type CloudinaryUploaderErrorResponse = { success: false; error: Error };

export type CloudinaryUploaderResponse =
  | CloudinaryUploaderSuccessResponse
  | CloudinaryUploaderErrorResponse;

interface CloudinaryUploaderProps {
  onUpload: (response: CloudinaryUploaderResponse) => void;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ onUpload }) => {
  return (
    <div className='w-fit rounded-xl bg-bege-light p-4'>
      <CldUploadWidget
        uploadPreset='hawkstars_test'
        onSuccess={(result, { widget }) => {
          onUpload({ success: true, data: result });
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </div>
  );
};

export default CloudinaryUploader;
