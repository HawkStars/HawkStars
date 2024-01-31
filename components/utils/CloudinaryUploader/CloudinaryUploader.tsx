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
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0];
  //     setSelectedFile(file);
  //   };

  //   const handleUpload = async () => {
  //     if (!selectedFile) {
  //       return;
  //     }

  //     try {
  //       const byteArrayBuffer = fs.readFileSync('shirt.jpg');
  //       const uploadResult = await new Promise((resolve) => {
  //         cloudinary.uploader
  //           .upload_stream((error, uploadResult) => {
  //             return resolve(uploadResult);
  //           })
  //           .end(byteArrayBuffer);
  //       });

  //       onUpload({ success: true, data: uploadResult as unknown as UploadApiResponse });
  //     } catch (error) {
  //       onUpload({ success: false, error: error as unknown as Error });
  //     }
  //   };

  return (
    <div className='bg-bege-light'>
      <CldUploadWidget
        uploadPreset='hawkstars_test'
        onSuccess={(result, { widget }) => {
          //   setResource(result?.info);
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            // setResource(undefined);
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>

      {/* <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button> */}
    </div>
  );
};

export default CloudinaryUploader;
