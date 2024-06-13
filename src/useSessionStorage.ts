export const useSessionStorage = (key:string)  => {
    const setItem = (value:string) => {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    };
  
    return { setItem};
  };