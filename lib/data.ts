export const APP_NAME = "Fresh Basket";
export const APP_TAGLINE = "Farm Fresh, Delivered Fast";
export const APP_EMAIL = "hello@freshbasket.com";
export const APP_PHONE = "+1 (800) 555-0192";
export const APP_ADDRESS = "123 Market Street, San Francisco, CA 94103";

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cart", href: "/cart" },
];

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  weight: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
};

export type Category =
  | "Fruits"
  | "Vegetables"
  | "Dairy"
  | "Bakery"
  | "Beverages"
  | "Snacks";

export const CATEGORIES: Category[] = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Beverages",
  "Snacks",
];

export type CartItem = Product & { quantity: number };