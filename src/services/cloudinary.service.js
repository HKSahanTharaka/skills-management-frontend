import api from './api';

export const cloudinaryService = {
  async uploadImage(file) {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.url) {
        return response.data.url;
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.error || 'Failed to upload image');
    }
  },
};

export default cloudinaryService;

