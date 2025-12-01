import { useState, useEffect } from 'react';

/**
 * Hook to preload images before displaying content
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 * @returns {Object} - { loading, progress, error }
 */
const useImagePreloader = (imageUrls) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      // Still wait 2 seconds even if no images
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      setProgress(100);
      return () => clearTimeout(timer);
    }

    const startTime = Date.now();
    const MINIMUM_DISPLAY_TIME = 1000; // 2 seconds minimum
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    const imagePromises = [];

    imageUrls.forEach((url) => {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          loadedCount++;
          setProgress((loadedCount / totalImages) * 100);
          resolve(url);
        };

        img.onerror = () => {
          loadedCount++;
          setProgress((loadedCount / totalImages) * 100);
          console.warn(`Failed to load image: ${url}`);
          resolve(url); // Resolve anyway to not block other images
        };

        img.src = url;
      });

      imagePromises.push(promise);
    });

    Promise.all(imagePromises)
      .then(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsedTime);
        
        // Wait for the remaining time to ensure minimum 2 seconds display
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      })
      .catch((err) => {
        console.error('Error preloading images:', err);
        setError(err);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsedTime);
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      });

    // Cleanup
    return () => {
      // Don't set loading to false on cleanup, let the timeout handle it
    };
  }, [imageUrls]);

  return { loading, progress, error };
};

export default useImagePreloader;

