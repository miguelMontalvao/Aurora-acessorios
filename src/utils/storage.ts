import { supabase, STORAGE_BUCKET } from '../lib/supabase';

/**
 * Redimensiona e comprime uma imagem (max 1000×1000, JPEG 82%)
 * Retorna um Blob pronto para upload.
 */
export const compressImageToBlob = (file: File): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const MAX = 1000;
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar blob'))),
          'image/jpeg',
          0.82
        );
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

/**
 * Faz upload de uma imagem para o Supabase Storage e retorna a URL pública.
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  const blob = await compressImageToBlob(file);
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, blob, { contentType: 'image/jpeg', cacheControl: '3600' });

  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
};

/** Gera ID único (slug) para novos produtos */
export const generateId = (): string =>
  `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
