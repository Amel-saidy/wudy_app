export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Use VITE_API_URL from environment variables, fallback to localhost
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Clean up the base URL (remove trailing slash)
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Clean up the path (ensure it starts with a slash if it doesn't already)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};
