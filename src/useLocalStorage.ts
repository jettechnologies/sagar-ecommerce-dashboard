export const useLocalStorage = (key: string) => {
    const setItem = (value: string) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    };
  
    return { setItem};
  };