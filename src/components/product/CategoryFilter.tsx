import type { Category } from '../../types';
import { categoryLabels } from '../../data/products';

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
  counts: Record<string, number>;
}

const CATEGORIES: Category[] = ['todos', 'brincos', 'colares', 'pulseiras', 'aneis', 'conjuntos', 'relogios', 'acessorios'];

const CategoryFilter = ({ active, onChange, counts }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`font-body text-xs font-medium tracking-widest2 uppercase px-5 py-2.5 border transition-all duration-200 ${
            active === cat
              ? 'bg-marrom text-bege border-marrom'
              : 'bg-transparent text-marrom border-nude hover:border-marrom hover:bg-marrom/5'
          }`}
        >
          {categoryLabels[cat]}
          {cat !== 'todos' && counts[cat] > 0 && (
            <span
              className={`ml-1.5 text-[10px] font-normal ${
                active === cat ? 'text-dourado' : 'text-dourado/60'
              }`}
            >
              ({counts[cat]})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
