import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(onLoadMore, hasMore, isLoading) {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        {
          rootMargin: '200px', // Trigger slightly before it comes into view
          threshold: 0.1,
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return lastElementRef;
}
