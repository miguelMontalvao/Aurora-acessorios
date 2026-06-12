import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const badgeColors: Record<string, string> = {
  'Novo': 'bg-marrom text-bege',
  'Mais Vendido': 'bg-dourado text-marrom-dark',
  'Últimas unidades': 'bg-terracota text-bege',
  'Exclusivo': 'bg-marrom-dark text-dourado',
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className={`card-product group ${!product.inStock ? 'opacity-75' : ''}`}>
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-bege-50">
        <img
          src={imageError
            ? `https://placehold.co/500x500/EAE2D3/5A3E2B?text=${encodeURIComponent(product.name)}`
            : product.image}
          alt={product.name}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            product.inStock ? 'group-hover:scale-105' : ''
          }`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-marrom/0 group-hover:bg-marrom/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="bg-bege text-marrom p-3 shadow-soft hover:bg-dourado hover:text-marrom-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Adicionar à bolsa"
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        {/* Badge categoria/promoção */}
        {product.badge && (
          <span className={`badge font-body text-[10px] ${badgeColors[product.badge] || 'bg-marrom text-bege'}`}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="badge left-auto right-3 bg-terracota text-bege text-[10px] font-body">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-end">
            <div className="w-full bg-marrom/80 py-2 text-center">
              <span className="font-body text-xs text-bege/80 tracking-widest2 uppercase">Esgotado</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <p className="font-body text-[10px] tracking-widest2 uppercase text-dourado/70">
          {product.material}
        </p>
        <h3 className="font-display text-lg font-light text-marrom leading-snug">
          {product.name}
        </h3>
        <p className="font-body text-xs text-marrom/50 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Preço — empilhado acima do botão, sem ficar colado */}
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-medium text-marrom">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-body text-sm text-marrom/40 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full font-body text-xs font-medium tracking-widest2 uppercase py-2.5
              transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              added
                ? 'bg-dourado text-marrom-dark'
                : 'border border-marrom text-marrom hover:bg-marrom hover:text-bege'
            }`}
            aria-label={added ? 'Adicionado!' : 'Adicionar à bolsa'}
          >
            {added ? '✓ Adicionado' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
