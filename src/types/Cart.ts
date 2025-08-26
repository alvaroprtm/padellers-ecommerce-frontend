import type { Product } from './Products';

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