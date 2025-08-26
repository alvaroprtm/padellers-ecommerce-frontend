export interface User {
id: number;
name: string;
email?: string;
role: string;
token?: string;
}

export interface Product {
id: number;
user_id: number;
name: string;
description: string | null;
price: string;
image_url: string | null;
created_at: string;
updated_at: string;
user?: User;
}

export interface CartItem {
  id: string; 
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  price: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
products: Product[];
}

export interface LoginPayload {
email: string;
password: string;
}

export interface RegisterPayload {
name: string;
email: string;
password: string;
password_confirmation: string;
role: string;
}

export interface ApiResponse<T = any> {
data: T;
message?: string;
status: number;
}

export interface ApiError {
message: string;
errors?: Record<string, string[]>;
}

export interface SelectOption {
value: string;
label: string;
}