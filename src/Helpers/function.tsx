
export const capitalizeFirstLetter = (text?: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};


  export const debounce = (func: (...args: any[]) => void, limit: number) => {
    let inDebounce: ReturnType<typeof setTimeout> | null = null;
  
    return function (this: any, ...args: any[]) {
      if (inDebounce) {
        clearTimeout(inDebounce);
      }
      inDebounce = setTimeout(() => {
        func.apply(this, args);
        inDebounce = null; 
      }, limit);
    };
  };

  export const Throttle = (func: (...args: any[]) => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return function (...args: any[]) {
      if (timeout) {
        clearTimeout(timeout);
      }
  
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
      }, delay);
    };
  };