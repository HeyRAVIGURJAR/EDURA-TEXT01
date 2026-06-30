import { useState, useEffect } from 'react';

/**
 * useDebounce — Custom hook to throttle rapidly changing inputs.
 * Delays updating the debounced value until after the specified delay
 * has passed since the last time the value changed.
 * Useful for search inputs to prevent firing API calls on every keystroke.
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time
    // useEffect is re-called. useEffect will only be re-called
    // if value changes (see the inputs array below).
    // This is how we prevent debouncedValue from changing if value is
    // changed within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
