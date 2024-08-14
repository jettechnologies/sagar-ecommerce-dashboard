export const validateObject = <T extends Record<string, any>>(obj: T): boolean => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined || value === "") {
        throw new Error(`The value for key "${key}" is empty.`);
      }
    }
    return true;
  };

  export const validateObjectWithStr = <T extends Record<string, { str: string; error: boolean }>>(obj: T): boolean => {
    for (const [key, value] of Object.entries(obj)) {
      if (value.str === null || value.str === undefined || value.str === "") {
        throw new Error(`The value for key "${key}" is empty.`);
      }
    }
    return true;
  };