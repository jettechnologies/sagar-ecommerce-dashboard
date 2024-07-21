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
    baseUrl: string;
    defaultHeaders: HeadersInit;
  
    constructor(baseUrl = `${import.meta.env.VITE_PRODUCT_LIST_API}`, defaultHeaders: HeadersInit = {}) {
      this.baseUrl = baseUrl;
      this.defaultHeaders = defaultHeaders;
    }
  
    private async request(method: string, url: string, headers?: HeadersInit, body?: any): Promise<any> {
      const options: RequestInit = {
        method,
        headers: { ...this.defaultHeaders, ...headers },
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      };
  
      if (body instanceof FormData) {
        if (options.headers && 'Content-Type' in options.headers) {
            delete (options.headers as Headers)['Content-Type']; // Let browser set it automatically
        }
      }
  
      try {
        const response = await fetch(`${this.baseUrl}${url}`, options);
        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || 'Error fetching data');
        }
        return resData;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    }
  
    async get(url: string, headers?: HeadersInit): Promise<any> {
      return this.request('GET', url, headers);
    }
  
    async post(url: string, headers: HeadersInit, data: Data): Promise<any> {
      return this.request('POST', url, headers, data);
    }
  
    async patch(url: string, headers: HeadersInit, data: Data): Promise<any> {
      return this.request('PATCH', url, headers, data);
    }
  
    async delete(url: string, headers: HeadersInit): Promise<any> {
      return this.request('DELETE', url, headers);
    }
  
    async imgUpload(url: string, headers: HeadersInit, data: ImageUploadData): Promise<any> {
      return this.request('PATCH', url, headers, data.formData);
    }
  
    async formData(
      url: string,
      headers: HeadersInit,
      formData: FormData,
      method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
    ): Promise<any> {
      return this.request(method, url, headers, formData);
    }
  }
  