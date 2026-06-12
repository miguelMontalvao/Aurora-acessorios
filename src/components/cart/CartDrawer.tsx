import { useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-marrom/40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 bg-bege flex flex-col shadow-soft-lg
          transform transition-transform duration-400 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Bolsa de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-nude/60">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-marrom" />
            <h2 className="font-display text-xl font-light text-marrom">Minha Bolsa</h2>
            {totalItems > 0 && (
              <span className="bg-dourado text-marrom-dark text-xs font-body font-medium px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-marrom/50 hover:text-marrom transition-colors"
            aria-label="Fechar bolsa"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag size={48} className="text-nude mb-4" strokeWidth={1} />
              <p className="font-display text-xl font-light text-marrom/50 mb-2">Sua bolsa está vazia</p>
              <p className="font-body text-sm text-marrom/40">Adicione peças do catálogo</p>
              <button
                onClick={closeCart}
                className="btn-ghost mt-6 text-xs"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 py-4 border-b border-nude/40 last:border-0"
              >
                {/* Product image */}
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-bege-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        `https://placehold.co/80x80/EAE2D3/5A3E2B?text=Aurora`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-base font-light text-marrom leading-tight truncate">
                    {product.name}
                  </h4>
                  <p className="font-body text-xs text-marrom/50 mt-0.5 mb-2 line-clamp-1">
                    {product.material}
                  </p>
                  <span className="font-display text-base font-medium text-marrom">
                    {formatCurrency(product.price * quantity)}
                  </span>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 border border-nude flex items-center justify-center text-marrom hover:border-marrom transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-body text-sm font-medium text-marrom w-5 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 border border-nude flex items-center justify-center text-marrom hover:border-marrom transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="ml-auto p-1.5 text-marrom/30 hover:text-terracota transition-colors"
                      aria-label="Remover item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-nude/60 px-6 py-6 space-y-4 bg-white/40">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-marrom/70">Subtotal</span>
              <span className="font-display text-xl font-medium text-marrom">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p className="font-body text-xs text-marrom/40">
              Frete e entrega a combinar via WhatsApp.
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-primary w-full flex items-center justify-center gap-2 text-center"
            >
              Finalizar Pedido
              <ChevronRight size={15} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center font-body text-xs text-marrom/50 hover:text-marrom transition-colors py-1"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
