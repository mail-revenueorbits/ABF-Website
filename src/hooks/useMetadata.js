import { useEffect } from 'react';

/**
 * Custom hook to dynamically set document title and meta description.
 * @param {string} title - The browser tab title
 * @param {string} description - The SEO meta description
 */
export function useMetadata(title, description) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = `${title} | AB Furniture Nepal`;
    }

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
}

export default useMetadata;
