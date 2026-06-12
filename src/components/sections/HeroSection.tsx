import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import AuroraLogo from '../ui/AuroraLogo';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = window.scrollY;
      hero.style.transform = `translateY(${y * 0.4}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-texture">
      {/* Background gradient */}
      <div
        ref={heroRef}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, #D9C7BB 0%, #EAE2D3 50%, #DDD0B8 100%)',
        }}
      />

      {/* Decorative corner lines */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-dourado/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-dourado/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-dourado/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-dourado/30" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-dourado/30"
          style={{
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
            animation: `shimmer ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fade-in">
        {/* Pre-headline */}
        <p
          className="font-body text-xs tracking-widest3 uppercase text-dourado font-medium mb-8 opacity-0 animate-fade-in stagger-1"
          style={{ animationFillMode: 'forwards' }}
        >
          
        </p>

        {/* Main logo large */}
        <div
          className="mb-8 opacity-0 animate-slide-up stagger-2"
          style={{ animationFillMode: 'forwards' }}
        >
          <AuroraLogo variant="full" color="dark" size="xl" />
        </div>

        {/* Sub-headline */}
        <p
          className="font-display font-light italic text-marrom/70 text-lg md:text-2xl max-w-md mt-4 opacity-0 animate-fade-in stagger-3"
          style={{ animationFillMode: 'forwards' }}
        >
          Acessórios que realçam o seu brilho
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-10 opacity-0 animate-slide-up stagger-4"
          style={{ animationFillMode: 'forwards' }}
        >
          <button onClick={scrollToCatalog} className="btn-primary">
            Ver Catálogo
          </button>
          <a
            href="https://wa.me/5521997569522"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Falar no WhatsApp
          </a>
        </div>

        {/* Trust indicators */}
        <div
          className="flex items-center gap-6 mt-12 opacity-0 animate-fade-in stagger-5"
          style={{ animationFillMode: 'forwards' }}
        >
          {['Banhado a ouro 18k', 'Banhado a prata 925', 'Aço inoxidável'].map((item, i) => (
            <div key={item} className="flex items-center gap-2 text-marrom/50">
              {i > 0 && (
                <svg width="4" height="4" viewBox="0 0 4 4" className="flex-shrink-0">
                  <polygon points="2,0 4,2 2,4 0,2" fill="#C7A86D" opacity="0.5" />
                </svg>
              )}
              <span className="font-body text-xs tracking-wide">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToCatalog}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-marrom/40 hover:text-dourado transition-colors duration-300 animate-fade-in stagger-5"
        style={{ animationFillMode: 'forwards' }}
        aria-label="Rolar para baixo"
      >
        <span className="font-body text-[10px] tracking-widest2 uppercase">Explorar</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
