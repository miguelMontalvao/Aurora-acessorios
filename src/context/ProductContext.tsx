import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product, ProductRow } from '../types';
import { supabase, TABLE_PRODUCTS } from '../lib/supabase';
import { rowToProduct, productToRow } from '../utils/productMapper';
import { products as fallbackProducts } from '../data/products';
import { generateId } from '../utils/storage';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial
  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      const { data, error: err } = await supabase
        .from(TABLE_PRODUCTS)
        .select('*')
        .order('created_at', { ascending: true });

      if (!active) return;

      if (err) {
        console.error('Erro ao buscar produtos do Supabase:', err.message);
        setError(err.message);
        // Fallback para os produtos de exemplo locais (modo offline / sem Supabase configurado)
        setProducts(fallbackProducts);
      } else {
        setProducts((data as ProductRow[]).map(rowToProduct));
        setError(null);
      }
      setLoading(false);
    };

    fetchProducts();

    // Realtime: qualquer INSERT/UPDATE/DELETE na tabela atualiza todo mundo automaticamente
    const channel = supabase
      .channel('products-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_PRODUCTS }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addProduct = useCallback(async (p: Omit<Product, 'id'>) => {
    const row = productToRow({ ...p, id: generateId() });
    const { error: err } = await supabase.from(TABLE_PRODUCTS).insert(row);
    if (err) throw err;
  }, []);

  const updateProduct = useCallback(async (p: Product) => {
    const row = productToRow(p);
    const { error: err } = await supabase.from(TABLE_PRODUCTS).update(row).eq('id', p.id);
    if (err) throw err;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { error: err } = await supabase.from(TABLE_PRODUCTS).delete().eq('id', id);
    if (err) throw err;
  }, []);

  const toggleStock = useCallback(async (id: string) => {
    const current = products.find(p => p.id === id);
    if (!current) return;
    const { error: err } = await supabase
      .from(TABLE_PRODUCTS)
      .update({ in_stock: !current.inStock })
      .eq('id', id);
    if (err) throw err;
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, loading, error, addProduct, updateProduct, deleteProduct, toggleStock }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
};
