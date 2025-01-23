
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