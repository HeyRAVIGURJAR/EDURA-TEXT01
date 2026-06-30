import { useState, useCallback, useEffect } from 'react';

// A mock API call since we are using LocalStorage primarily for likes
const mockServerLikeSync = async (badgeId, isLiked) => {
  return new Promise((resolve) => setTimeout(resolve, 500)); // Simulate 500ms network latency
};

export const useOptimisticLike = (badgeId, initialStatus = false) => {
  const [isLiked, setIsLiked] = useState(() => {
    // Check LocalStorage for persistence
    const savedLikes = JSON.parse(localStorage.getItem('edura_likes')) || {};
    return savedLikes[badgeId] || initialStatus;
  });

  const toggleLike = useCallback(async () => {
    const newStatus = !isLiked;
    
    // 1. Optimistic UI Update
    setIsLiked(newStatus);
    
    // 2. Persist to LocalStorage immediately
    const savedLikes = JSON.parse(localStorage.getItem('edura_likes')) || {};
    savedLikes[badgeId] = newStatus;
    localStorage.setItem('edura_likes', JSON.stringify(savedLikes));

    // 3. Sync with Server
    try {
      await mockServerLikeSync(badgeId, newStatus);
    } catch (error) {
      // Revert on failure
      console.error("Failed to sync like with server", error);
      setIsLiked(!newStatus);
      const revertedLikes = JSON.parse(localStorage.getItem('edura_likes')) || {};
      revertedLikes[badgeId] = !newStatus;
      localStorage.setItem('edura_likes', JSON.stringify(revertedLikes));
    }
  }, [badgeId, isLiked]);

  return { isLiked, toggleLike };
};
