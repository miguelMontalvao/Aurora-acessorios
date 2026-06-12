import { ExternalLink } from 'lucide-react';
import InstagramIcon from '../ui/InstagramIcon';

const InstagramSection = () => (
  <section id="contato" className="py-20 bg-bege-50 border-t border-nude/60">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <div className="flex items-center justify-center w-14 h-14 border border-dourado/40 mx-auto mb-6">
        <InstagramIcon size={26} className="text-dourado" />
      </div>
      <p className="section-subtitle mb-4">Siga a gente</p>
      <h2 className="font-display text-3xl md:text-4xl font-light text-marrom mb-4">
        @aaurora.acessorios
      </h2>
      <p className="font-body text-marrom/60 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
        Acompanhe as novidades, looks inspiradores e lançamentos em primeira mão no nosso Instagram.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://instagram.com/aaurora.acessorios"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <InstagramIcon size={15} />
          Seguir no Instagram
        </a>
        <a
          href="https://wa.me/5521997569522?text=Olá Aurora! Vim pelo site e quero saber mais 💛"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost inline-flex items-center justify-center gap-2"
        >
          <ExternalLink size={14} />
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  </section>
);

export default InstagramSection;
