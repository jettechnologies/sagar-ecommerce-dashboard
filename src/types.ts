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