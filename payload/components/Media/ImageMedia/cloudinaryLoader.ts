type CloudinaryLoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

const CLOUDINARY_HOST = 'res.cloudinary.com' as const;

export const cloudinaryLoader = ({ src, width, quality }: CloudinaryLoaderParams): string => {
  // If the src is already a full Cloudinary URL, inject transforms into it.
  // Expected shape: https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>
  const uploadMarker = '/upload/';
  const q = quality ? `q_${quality}` : 'q_auto';
  const params = `f_auto,${q},w_${width}`;

  if (src.includes(CLOUDINARY_HOST) && src.includes(uploadMarker)) {
    const [prefix, suffix] = src.split(uploadMarker);
    return `${prefix}${uploadMarker}${params}/${suffix}`;
  }

  // Fallback: src is just a public_id / path (no host) — build a full URL.
  return src;
};

export default cloudinaryLoader;
