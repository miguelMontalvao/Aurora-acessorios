import { useState, useEffect, useRef } from 'react';
import type { Category, MaterialType } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { materialLabels } from '../../data/products';
import ProductCard from '../product/ProductCard';
import CategoryFilter from '../product/CategoryFilter';

const MATERIALS: MaterialType[] = ['todos', 'ouro', 'prata', 'aco-inox'];
const materialIcons: Record<string, string> = { todos: '', ouro: '', prata: '', 'aco-inox': '' };

const CatalogSection = () => {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const [activeMaterial, setActiveMaterial] = useState<MaterialType>('todos');
  const headerRef = useRef<HTMLDivElement>(null);

  const filtered = products
    .filter(p => activeCategory === 'todos' || p.category === activeCategory)
    .filter(p => activeMaterial === 'todos' || p.materialType === activeMaterial);

  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const materialCounts = products
    .filter(p => activeCategory === 'todos' || p.category === activeCategory)
    .reduce<Record<string, number>>((acc, p) => {
      acc[p.materialType] = (acc[p.materialType] || 0) + 1;
      return acc;
    }, {});

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    headerRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setActiveMaterial('todos');
  };

  const filterKey = `${activeCategory}-${activeMaterial}`;

  return (
    <section id="catalogo" className="py-24 bg-bege bg-texture">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={headerRef}>
          <div className="text-center mb-14 reveal">
            <p className="section-subtitle mb-4">Nossas peças</p>
            <h2 className="section-title mb-4">Catálogo Aurora</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-dourado/40" />
              <svg width="6" height="6" viewBox="0 0 6 6"><polygon points="3,0 6,3 3,6 0,3" fill="#C7A86D" /></svg>
              <div className="h-px w-12 bg-dourado/40" />
            </div>
            <p className="font-body text-marrom/60 text-sm max-w-md mx-auto">
              O detalhe perfeito para cada versão de você.
            </p>
          </div>

          <div className="mb-5 reveal">
            <CategoryFilter active={activeCategory} onChange={handleCategoryChange} counts={counts} />
          </div>

          <div className="mb-12 reveal flex flex-wrap justify-center gap-2">
            {MATERIALS.map(mat => {
              const count = mat === 'todos'
                ? products.filter(p => activeCategory === 'todos' || p.category === activeCategory).length
                : (materialCounts[mat] || 0);
              return (
                <button
                  key={mat}
                  onClick={() => setActiveMaterial(mat)}
                  disabled={count === 0 && mat !== 'todos'}
                  className={`inline-flex items-center gap-1.5 font-body text-[11px] font-medium tracking-widest2 uppercase px-4 py-2 rounded-full border transition-all duration-200
                    ${activeMaterial === mat ? 'bg-dourado/20 border-dourado text-marrom' : 'bg-transparent border-nude/80 text-marrom/60 hover:border-dourado/60 hover:text-marrom'}
                    ${count === 0 && mat !== 'todos' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {materialIcons[mat] && <span className="text-[10px]">{materialIcons[mat]}</span>}
                  {mat === 'todos' ? 'Todos os materiais' : materialLabels[mat].replace('✦ ', '')}
                  <span className={`text-[10px] ${activeMaterial === mat ? 'text-dourado' : 'text-marrom/30'}`}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {(activeCategory !== 'todos' || activeMaterial !== 'todos') && (
          <div className="flex items-center justify-between mb-6">
            <p className="font-body text-xs text-marrom/50">{filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
            <button onClick={() => { setActiveCategory('todos'); setActiveMaterial('todos'); }} className="font-body text-xs text-dourado hover:text-dourado-dark underline underline-offset-2">Limpar filtros</button>
          </div>
        )}

        <div key={filterKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <div key={product.id} style={{ animation: 'catalogCardIn 0.45s ease forwards', animationDelay: `${(i % 8) * 0.06}s`, opacity: 0 }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-2xl font-light text-marrom/40 mb-3">Nenhum produto encontrado</p>
            <button onClick={() => { setActiveCategory('todos'); setActiveMaterial('todos'); }} className="font-body text-sm text-dourado underline underline-offset-2">Ver todos os produtos</button>
          </div>
        )}

        <div className="text-center mt-16 reveal">
          <p className="font-body text-sm text-marrom/50 mb-5">Não encontrou o que procura? Fale conosco!</p>
          <a href="https://wa.me/5521997569522?text=Olá! Gostaria de saber mais sobre os acessórios da Aurora." target="_blank" rel="noopener noreferrer" className="btn-ghost inline-block">
            Pedir pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
