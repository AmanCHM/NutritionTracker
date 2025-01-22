
export const firstLetterUpperCase = (message: string) => {
    if (message && message.length > 0) {
      return (
        message[0].toUpperCase() +
        message.substring(1, message.length).toLowerCase()
      );
    }
    return '';
  };