import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import AuroraLogo from '../ui/AuroraLogo';
import InstagramIcon from '../ui/InstagramIcon';

const NAV = [
  { label: 'Início', href: '/' },
  { label: 'Catálogo', href: '/#catalogo' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Contato', href: '/#contato' },
];

const Header = () => {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href === '/') {
      // FIX: rolar para o topo suavemente
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-bege/95 backdrop-blur-md shadow-soft py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-marrom p-1"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV.slice(0, 2).map(({ label, href }) => (
                <Link
                  key={label}
                  to={href.startsWith('/#') ? '/' : href}
                  onClick={() => handleNavClick(href)}
                  className="font-body text-xs font-medium tracking-widest2 uppercase text-marrom hover:text-dourado transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <Link to="/" onClick={() => handleNavClick('/')} className="flex-shrink-0 mx-4">
              <AuroraLogo variant="horizontal" color="dark" size="sm" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV.slice(2).map(({ label, href }) => (
                <Link
                  key={label}
                  to={href.startsWith('/#') ? '/' : href}
                  onClick={() => handleNavClick(href)}
                  className="font-body text-xs font-medium tracking-widest2 uppercase text-marrom hover:text-dourado transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://instagram.com/aaurora.acessorios"
                target="_blank"
                rel="noopener noreferrer"
                className="text-marrom hover:text-dourado transition-colors duration-200"
                aria-label="Instagram Aurora Acessórios"
              >
                <InstagramIcon size={18} />
              </a>
            </nav>

            {!isCheckout && (
              <button
                onClick={toggleCart}
                className="relative p-2 text-marrom hover:text-dourado transition-colors duration-200 ml-2"
                aria-label={`Bolsa de compras (${totalItems} itens)`}
              >
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-dourado text-marrom-dark text-[10px] font-body font-bold min-w-[18px] min-h-[18px] px-0.5 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-bege border-t border-nude/50 mt-2">
            <nav className="flex flex-col px-6 py-4 gap-4">
              {NAV.map(({ label, href }) => (
                <Link
                  key={label}
                  to={href.startsWith('/#') ? '/' : href}
                  onClick={() => handleNavClick(href)}
                  className="font-body text-xs font-medium tracking-widest2 uppercase text-marrom hover:text-dourado transition-colors duration-200 py-1"
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://instagram.com/aaurora.acessorios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-marrom hover:text-dourado transition-colors text-xs font-body font-medium tracking-widest2 uppercase py-1"
              >
                <InstagramIcon size={16} /> @aaurora.acessorios
              </a>
            </nav>
          </div>
        )}
      </header>
      {isCheckout && <div className="h-20" />}
    </>
  );
};

export default Header;
