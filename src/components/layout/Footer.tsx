import { MessageCircle, Heart } from 'lucide-react';
import AuroraLogo from '../ui/AuroraLogo';
import InstagramIcon from '../ui/InstagramIcon';

const Footer = () => (
  <footer className="bg-marrom text-bege/80">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div className="flex flex-col items-center md:items-start gap-4">
          <AuroraLogo variant="full" color="light" size="sm" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <h4 className="font-body text-xs font-medium tracking-widest2 uppercase text-dourado mb-2">
            Navegação
          </h4>
          {['Início', 'Catálogo', 'Sobre nós', 'Contato'].map(item => (
            <a key={item} href="#" className="font-body text-sm text-bege/60 hover:text-dourado transition-colors duration-200">
              {item}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <h4 className="font-body text-xs font-medium tracking-widest2 uppercase text-dourado mb-2">
            Conecte-se
          </h4>
          <a
            href="https://instagram.com/aaurora.acessorios"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-bege/70 hover:text-dourado transition-colors duration-200 group"
          >
            <InstagramIcon size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-body text-sm">@aaurora.acessorios</span>
          </a>
          <a
            href="https://wa.me/5521997569522"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-bege/70 hover:text-dourado transition-colors duration-200 group"
          >
            <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-body text-sm">(21) 99756-9522</span>
          </a>
          <p className="font-body text-xs text-bege/40 mt-2 text-right">
            Acessórios banhados<br />
            Variedade, Valor justo.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-bege/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-body text-xs text-bege/30 tracking-wide">
          © {new Date().getFullYear()} Aurora Acessórios. Todos os direitos reservados.
        </p>
        <p className="font-body text-xs text-bege/30 flex items-center gap-1">
          Feito com <Heart size={11} className="text-dourado/60 inline mx-1" /> no Rio de Janeiro
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
