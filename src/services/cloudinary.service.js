import { API_BASE_URL, AUTH_TOKEN_KEY } from '../utils/constants';

export const cloudinaryService = {
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Upload error:', data);
        throw new Error(data.error?.message || data.error || 'Failed to upload image');
      }

      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
};

export default cloudinaryService;

