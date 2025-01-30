
export const firstLetterUpperCase = (message: string) => {
    if (message && message.length > 0) {
      return (
        message[0].toUpperCase() +
        message.substring(1, message.length).toLowerCase()
      );
    }
    return '';
  };

  export const debounce = (func: (...args: any[]) => void, limit: number) => {
    let inDebounce: NodeJS.Timeout | null;
    return function(this: any, ...args: any[]) {
      if (inDebounce) {
        clearTimeout(inDebounce);
      }
      inDebounce = setTimeout(() => func.apply(this, args), limit);
    };
  };

  import { useState } from "react";

export const Throttle = (func:(...args: any[]) => void, delay:number ) =>{
    const [timeout, saveTimeout] = useState(null);
      
    const throttledFunc = function () {
      if (timeout) {
        clearTimeout(timeout);
      }
  
      const newTimeout = setTimeout(() => {
        func(...arguments);
        if (newTimeout === timeout) {
          saveTimeout(null);
        }
      }, delay);
  
      saveTimeout(newTimeout);
    }
  
    return throttledFunc;
  }
  