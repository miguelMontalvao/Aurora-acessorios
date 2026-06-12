import type { Product, ProductRow, Category, MaterialType } from '../types';

/** Converte uma linha do Supabase (snake_case) para o formato do app (camelCase) */
export const rowToProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  originalPrice: row.original_price ?? undefined,
  image: row.image,
  category: row.category as Category,
  material: row.material,
  materialType: row.material_type as MaterialType,
  inStock: row.in_stock,
  badge: (row.badge ?? undefined) as Product['badge'],
});

/** Converte o formato do app para o formato esperado pelo Supabase ao INSERIR/ATUALIZAR */
export const productToRow = (p: Omit<Product, 'id'> & { id?: string }): Omit<ProductRow, 'created_at'> => ({
  id: p.id ?? '',
  name: p.name,
  description: p.description,
  price: p.price,
  original_price: p.originalPrice ?? null,
  image: p.image,
  category: p.category,
  material: p.material,
  material_type: p.materialType,
  in_stock: p.inStock,
  badge: p.badge ?? null,
});
