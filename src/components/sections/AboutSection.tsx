import { useEffect, useRef } from 'react';
import { Sparkles, Heart} from 'lucide-react';

// Ícone de espelho de mão (SVG inline)
const MirrorIcon = ({ size = 22, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}          /* ← essa linha estava faltando */
  >
    <ellipse cx="12" cy="9" rx="6" ry="7.5" />
    <line x1="12" y1="16.5" x2="12" y2="21" />
    <line x1="9.5" y1="21" x2="14.5" y2="21" />
  </svg>
);

const values = [
  {
    Icon: Sparkles,
    title: 'Banhos',
    description: 'Cada item passa por rigoroso processo de banho, garantindo durabilidade e brilho duradouro.',
  },
  {
    Icon: MirrorIcon,      // ← espelho no lugar do escudo
    title: 'Princípios',
    description: 'Cada peça é cuidadosamente escolhida para garantir beleza, tendência e custo-benefício.',
  },
  {
    Icon: Heart,
    title: 'Especialmente para você',
    description: 'Mais do que acessórios: Detalhes que valorizam a sua auto-estima e completam seu estilo.',
  },
];

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="sobre" ref={ref} className="py-24 bg-marrom relative overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-texture opacity-30" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dourado/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dourado/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="font-body text-xs tracking-widest3 uppercase text-dourado font-medium mb-4">
            Nossa história
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-bege leading-tight mb-6">
            Do Básico ao Ousado
          </h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-dourado/40" />
            <svg width="8" height="8" viewBox="0 0 8 8">
              <polygon points="4,0 8,4 4,8 0,4" fill="#C7A86D" opacity="0.7" />
            </svg>
            <div className="h-px w-16 bg-dourado/40" />
          </div>
          <p className="font-body text-bege/60 text-base leading-relaxed max-w-xl mx-auto font-light">
            A nossa marca nasceu da paixão por acessórios que transformam qualquer look. 
            <br/>
            Com um olhar atento às tendências e um compromisso com a qualidade, selecionamos cada item para garantir que você encontre o acessório perfeito para expressar seu estilo único. Seja para um toque sutil ou uma declaração ousada, estamos aqui para ajudar você a brilhar em todas as ocasiões.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map(({ Icon, title, description }, i) => (
            <div
              key={title}
              className={`reveal flex flex-col items-center text-center p-8 border border-bege/10 hover:border-dourado/30 transition-all duration-300`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="w-12 h-12 flex items-center justify-center border border-dourado/40 mb-5">
                <Icon size={22} className="text-dourado" />
              </div>
              <h3 className="font-display text-xl font-light text-bege mb-3">{title}</h3>
              <p className="font-body text-sm text-bege/50 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14 reveal">
          <a
            href="https://instagram.com/aaurora.acessorios"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-block"
          >
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
