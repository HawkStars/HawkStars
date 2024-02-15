'use client';

import classNames from 'classnames';
import { CldUploadWidget, CldUploadWidgetResults } from 'next-cloudinary';
import React from 'react';

export type CloudinaryUploaderSuccessResponse = { success: true; data: CldUploadWidgetResults };
export type CloudinaryUploaderErrorResponse = { success: false; error: Error };

export type CloudinaryUploaderResponse =
  | CloudinaryUploaderSuccessResponse
  | CloudinaryUploaderErrorResponse;

interface CloudinaryUploaderProps {
  onUpload: (response: CloudinaryUploaderResponse) => void;
  customCss?: string;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ onUpload, customCss }) => {
  return (
    <div className={classNames('w-fit rounded-xl bg-bege-light p-4', customCss)}>
      <CldUploadWidget
        uploadPreset='hawkstars_test'
        onSuccess={(result) => {
          onUpload({ success: true, data: result });
        }}
        onUploadAdded={(result, options) => {
          console.log(result, options);
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
