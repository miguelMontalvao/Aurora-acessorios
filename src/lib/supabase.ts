import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase não configurado! Crie um arquivo .env na raiz do projeto ' +
    'com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. Veja SETUP.md para o passo a passo.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const STORAGE_BUCKET = 'product-images';
export const TABLE_PRODUCTS = 'products';
