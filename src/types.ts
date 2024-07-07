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
    RegisteredAt: string; 
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

  interface Category{
    id: number;
    name: string;
    description: string;
    createdAT: string;
    updatedAT: string;
  }

  export interface CategoryType extends Category{
    banner:string;
  }

  export  interface ProductType {
    availability: "in_stock" | "out_stock";
    available_colors: null | string;
    available_sizes: null | string;
    category: Category;
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
  
  type User = {
    id: number;
    userID: string;
    email: string;
    role: string;
    DOB: string | null;
    age: number | null;
    password: string;
    mobile: string;
    fullname: string;
    cityOfResidence: string;
    UpdatedAt: string;
    RegisteredAt: string;
    home_address: string;
    profile_picture: string;
    LGA_of_Home_Address: string | null;
    gender: string;
    Nationality: string | null;
    totalRevenue: string;
    isLoggedIn: boolean;
    isRegistered: boolean;
    isVerified: boolean;
    reset_link_exptime: string | null;
    password_reset_link: string | null;
  };
  
  type Item = {
    id: number;
    quantity: number;
    price: string;
  };
  
  export type Order = {
    id: number;
    orderID: string;
    name: string | null;
    mobile: string | null;
    billing_address: string | null;
    email: string | null;
    subTotal: string;
    discount: string | null;
    IsCouponCodeApplied: boolean;
    shippinFee: string;
    total: string;
    isPaid: boolean;
    orderType: string | null;
    paymentMethod: string | null;
    createdAT: string;
    trackingID: string;
    status: string;
    updatedAT: string | null;
    dropoffpincode: string | null;
    pickuppincode: string | null;
    weight: string;
    user: User;
    items: Item[];
  };
  