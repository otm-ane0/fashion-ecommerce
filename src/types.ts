export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'women' | 'men' | 'accessories';
  subcategory: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: CartItem[];
}

export interface Filters {
  category: string;
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  sortBy: string;
}
