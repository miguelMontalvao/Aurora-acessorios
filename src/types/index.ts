export type Category = 'todos' | 'brincos' | 'colares' | 'pulseiras' | 'aneis' | 'conjuntos' | 'relogios' | 'acessorios';
export type MaterialType = 'todos' | 'ouro' | 'prata' | 'aco-inox';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  material: string;
  materialType: MaterialType;
  inStock: boolean;
  badge?: 'Novo' | 'Mais Vendido' | 'Últimas unidades' | 'Exclusivo';
}

/** Formato exato como os dados ficam na tabela `products` do Supabase (snake_case) */
export interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image: string;
  category: string;
  material: string;
  material_type: string;
  in_stock: boolean;
  badge: string | null;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderForm {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: 'pickup' | 'delivery';
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: string;
  notes: string;
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface PricingInput {
  packagingCost: number;
  pieceCost: number;
  markup: number;
  quantity: number;
}

export interface PricingResult {
  totalCost: number;
  suggestedPrice: number;
  profit: number;
  margin: number;
  totalRevenue: number;
  totalProfit: number;
}
