export const useLocalStorage = (key: string) => {
    const setItem = (value: string | Record<string, string>) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    };
  
    return { setItem};
  };