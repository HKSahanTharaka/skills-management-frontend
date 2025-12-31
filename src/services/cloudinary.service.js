import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../utils/constants';

export const cloudinaryService = {
  async uploadImage(file) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Cloudinary upload error:', data);
        throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
      }

      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
};

export default cloudinaryService;

