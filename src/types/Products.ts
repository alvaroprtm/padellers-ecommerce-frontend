export interface User {
    id: number;
    name: string;
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

export interface ProductsResponse {
  products: Product[];
}