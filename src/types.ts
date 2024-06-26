export interface AdminDataType {
    id: number;
    adminID: number | null;
    email: string;
    role: string;
    adminType: string; 
    adminAccessLevel: string;
    password: string;
    mobile: string;
    fullname: string; 
    updatedAt: string | null;
    registeredAt: string; 
    profilePicture: string;
    gender: string | null;
    nationality: string | null;
    isLoggedIn: boolean;
    isRegistered: boolean;
    isActivated: boolean;
    isDeactivated: boolean;
    isVerified: boolean;
    resetLinkExpTime: string | null;
    passwordResetLink: string | null; 
  }

  export  interface ProductType {
    availability: "in_stock" | "out_stock";
    available_colors: null | string;
    available_sizes: null | string;
    category: {
      id: number;
      name: string;
      description: string;
      createdAT: string;
      updatedAT: string;
    };
    createdAT: string;
    description: string;
    favourites: any[];
    hasTax: boolean;
    id: number;
    isOutOfStock: boolean;
    minWholesaleQuantity: number;
    name: string;
    price: string;
    productID: string;
    productImage: string;
    purchaseCount: number;
    restockedAT: null | string;
    stock: number;
    stockAdjustedAT: null | string;
    taxRate: string;
    updatedAT: null | string;
    video: any[];
    wholesalePrice: string;
  }

  interface AdminResponse {
    fullname: string;
    email: string;
    password: string;
    admintype: string;
    mobile: string;
    role: string;
    Nationality: string | null;
    adminaccessLevel: string;
    RegisteredAt: string; // Assuming this is a string representing a date/time
    isActivated: boolean;
    isRegistered: boolean;
    isVerified: boolean;
    adminID: number | null;
    UpdatedAt: string | null; // Assuming this is a string representing a date/time or null
    profile_picture: string | null;
    gender: string | null;
    isLoggedIn: boolean;
    isDeactivated: boolean;
    reset_link_exptime: string | null; // Assuming this is a string representing a date/time or null
    password_reset_link: string | null;
    id: number;
  }
  
  export interface AdminRegistrationResponse {
    message: string;
    response: AdminResponse;
    loginCredential: string;
  }
  
  export interface AdminType {
    id: number;
    adminID: string;
    email: string;
    role: string;
    admintype: string;
    adminaccessLevel: string;
    password: string;
    mobile: string;
    fullname: string;
    home_address: string | null;
    UpdatedAt: string | null;
    RegisteredAt: string;
    profile_picture: string | null;
    gender: string | null;
    Nationality: string | null;
    isLoggedIn: boolean;
    isRegistered: boolean;
    isActivated: boolean;
    isDeactivated: boolean;
    isVerified: boolean;
    reset_link_exptime: string | null;
    password_reset_link: string | null;
  }
  
