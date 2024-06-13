export interface Headers {
    [key: string]: string;
  }
  
  export interface Data {
    [key: string]: any;
  }
  
  interface ImageUploadData {
    formData: FormData;
    msg: string;
  }
  
  export class EasyHTTP {
    // Make an HTTP GET Request 
    async get(url: string): Promise<any> {
      try {
        const response = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`);
        const resData = await response.json();
        return resData;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  
    // Make an HTTP POST Request
    async post(url: string, headers: Headers, data: Data): Promise<any> {
      const response = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message);
      }
      return resData;
    }
  
    // Make an HTTP PATCH Request
    async patch(url: string, headers: Headers, data: Data): Promise<any> {
      const response = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(data)
      });
  
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      return resData;
    }
  
    // Make an image upload
    async imgUpload(url: string, headers: Headers, data: ImageUploadData): Promise<any> {
      const response = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
        method: 'PATCH',
        headers: headers,
        body: data.formData
      });
  
      const resData = data.msg;
      if (!response.ok) throw new Error("File upload not possible");

      return resData;
    }
  
    // Make an HTTP DELETE Request
    async delete(url: string, headers: Headers, msg: string): Promise<any> {
      const response = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
        method: 'DELETE',
        headers: headers
      });
  
      const resData = await msg;
      if (!response.ok) throw new Error("Item delete not possible");
      return resData;
    }
  }
  