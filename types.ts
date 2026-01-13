
export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN',
  SERVER = 'SERVER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  joinedDate?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  order?: number;
}

export interface VariantOption {
  name: string;
  priceModifier: number;
}

export interface VariantGroup {
  name: string;
  options: VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  sku?: string;
  stock?: number;
  status?: 'available' | 'low_stock' | 'out_of_stock';
  description?: string;
  variantGroups?: VariantGroup[];
}

export interface OrderItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed';
  items: OrderItem[];
  total: number;
  createdAt: Date;
  type: 'dine-in' | 'takeaway';
}
