import { useState, useRef, useCallback } from 'react';
import {
  Calculator, Package, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Upload, X, Save, ArrowLeft, TrendingUp, DollarSign, RotateCcw,
  AlertTriangle, CheckCircle, ImageOff, Tag, LogOut, WifiOff
} from 'lucide-react';
import type { Product, PricingInput, PricingResult, Category, MaterialType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { uploadProductImage } from '../utils/storage';
import { useProducts } from '../context/ProductContext';
import AuroraLogo from '../components/ui/AuroraLogo';

// ─── PRICING CALCULATOR ──────────────────────────────────
const INITIAL_PRICING: PricingInput = { packagingCost: 0, pieceCost: 0, markup: 100, quantity: 1 };

const calcPrice = (input: PricingInput): PricingResult => {
  const totalCost = input.packagingCost + input.pieceCost;
  const suggestedPrice = totalCost * (1 + input.markup / 100);
  const profit = suggestedPrice - totalCost;
  const margin = suggestedPrice > 0 ? (profit / suggestedPrice) * 100 : 0;
  return { totalCost, suggestedPrice, profit, margin, totalRevenue: suggestedPrice * input.quantity, totalProfit: profit * input.quantity };
};

// ─── PRODUCT FORM ─────────────────────────────────────────
const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '', description: '', price: 0, originalPrice: undefined,
  image: '', category: 'brincos', material: '', materialType: 'ouro',
  inStock: true, badge: undefined,
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'brincos', label: 'Brincos' },
  { value: 'colares', label: 'Colares' },
  { value: 'pulseiras', label: 'Pulseiras' },
  { value: 'aneis', label: 'Anéis' },
  { value: 'conjuntos', label: 'Conjuntos' },
  { value: 'relogios', label: 'Relógios' },
  { value: 'acessorios', label: 'Acessórios' },
];

const MATERIAL_TYPES: { value: MaterialType; label: string }[] = [
  { value: 'ouro', label: '🪙 Ouro 18k' },
  { value: 'prata', label: '🥈 Prata 925' },
  { value: 'aco-inox', label: '⚙️ Aço Inoxidável' },
];

const BADGES = ['', 'Novo', 'Mais Vendido', 'Exclusivo', 'Últimas unidades'];

// ─── TOAST ────────────────────────────────────────────────
interface Toast { msg: string; type: 'ok' | 'err' }

// ─── MAIN ADMIN PAGE ──────────────────────────────────────
type Tab = 'produtos' | 'calculadora';
type ProductView = 'list' | 'form';

const SESSION_KEY = 'aurora_admin_authed';

const AdminPage = () => {
  const [tab, setTab] = useState<Tab>('produtos');
  const { products, loading, error, addProduct, updateProduct, deleteProduct, toggleStock } = useProducts();

  // Product management state
  const [view, setView] = useState<ProductView>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pricing state
  const [pricing, setPricing] = useState<PricingInput>(INITIAL_PRICING);
  const pricingResult = calcPrice(pricing);

  // ── Helpers ─────────────────────────────────────────────
  const showToast = (msg: string, type: Toast['type'] = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImagePreview('');
    setImageFile(null);
    setView('form');
  };

  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    const { id, ...rest } = p;
    void id;
    setForm(rest);
    setImagePreview(p.image);
    setImageFile(null);
    setView('form');
  };

  const cancelForm = () => {
    setView('list');
    setEditingProduct(null);
    setImagePreview('');
    setImageFile(null);
  };

  // ── Image handling ───────────────────────────────────────
  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { showToast('Arquivo inválido. Use JPG, PNG ou WEBP.', 'err'); return; }
    if (file.size > 10 * 1024 * 1024) { showToast('Imagem muito grande (máx 10MB).', 'err'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }, [handleImageFile]);

  // ── Save / Delete ────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { showToast('Digite o nome do produto.', 'err'); return; }
    if (!form.price || form.price <= 0) { showToast('Digite um preço válido.', 'err'); return; }
    if (!imagePreview && !form.image) { showToast('Adicione uma foto ao produto.', 'err'); return; }
    if (!form.material.trim()) { showToast('Digite o material do produto.', 'err'); return; }

    setSaving(true);
    try {
      let imageUrl = form.image;

      // Se uma nova imagem foi selecionada, faz upload primeiro
      if (imageFile) {
        setImageLoading(true);
        imageUrl = await uploadProductImage(imageFile);
        setImageLoading(false);
      }

      const cleanForm = {
        ...form,
        image: imageUrl,
        originalPrice: form.originalPrice || undefined,
        badge: (form.badge as string) === '' ? undefined : form.badge,
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, ...cleanForm });
        showToast('Produto atualizado para todo o site! ✓');
      } else {
        await addProduct(cleanForm);
        showToast('Produto cadastrado e visível para todos! ✓');
      }
      setView('list');
      setEditingProduct(null);
      setImageFile(null);
    } catch (e) {
      console.error(e);
      showToast('Erro ao salvar. Verifique sua conexão e configuração do Supabase.', 'err');
    } finally {
      setSaving(false);
      setImageLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      showToast('Produto removido para todo o site.');
    } catch {
      showToast('Erro ao excluir produto.', 'err');
    }
    setConfirmDelete(null);
  };

  const handleToggleStock = async (id: string) => {
    try {
      await toggleStock(id);
    } catch {
      showToast('Erro ao atualizar estoque.', 'err');
    }
  };

  // ── Filtered list ────────────────────────────────────────
  const visibleProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stockCount = products.filter(p => p.inStock).length;

  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-marrom" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 shadow-lg text-sm font-medium transition-all duration-300 ${toast.type === 'ok' ? 'bg-dourado text-marrom-dark' : 'bg-red-500 text-white'}`}>
          {toast.type === 'ok' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Connection warning */}
      {error && (
        <div className="bg-red-900/30 border-b border-red-500/30 px-6 py-2 flex items-center gap-2 justify-center">
          <WifiOff size={14} className="text-red-400" />
          <p className="font-body text-xs text-red-300">
            Supabase não conectado — mostrando dados de exemplo. Veja <strong>SETUP.md</strong> para configurar.
          </p>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-bege p-8 max-w-sm w-full shadow-soft-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-terracota flex-shrink-0" />
              <h3 className="font-display text-xl font-light text-marrom">Confirmar exclusão</h3>
            </div>
            <p className="font-body text-sm text-marrom/70 mb-6 leading-relaxed">
              Tem certeza? Essa ação não pode ser desfeita. O produto será removido permanentemente para todos os visitantes do site.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 btn-ghost text-xs">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-terracota text-bege font-body text-xs font-medium tracking-widest2 uppercase px-4 py-3 hover:bg-red-700 transition-colors">
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-marrom-dark border-b border-bege/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <AuroraLogo variant="horizontal" color="light" size="sm" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-dourado animate-pulse'}`} />
            <span className="font-body text-xs text-bege/40 tracking-widest2 uppercase">Painel Admin</span>
          </div>
          <button onClick={handleLogout} title="Sair" className="flex items-center gap-1.5 font-body text-xs text-bege/40 hover:text-bege transition-colors">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-bege/10 px-6">
        <div className="max-w-6xl mx-auto flex gap-1">
          {([
            { id: 'produtos', icon: Package, label: 'Gerenciar Produtos' },
            { id: 'calculadora', icon: Calculator, label: 'Calculadora de Preço' },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id === 'produtos') setView('list'); }}
              className={`flex items-center gap-2 px-5 py-4 font-body text-xs font-medium tracking-widest2 uppercase border-b-2 transition-colors duration-200 ${
                tab === id ? 'border-dourado text-dourado' : 'border-transparent text-bege/40 hover:text-bege/70'
              }`}
            >
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ═══════════ TAB: PRODUTOS ═══════════ */}
        {tab === 'produtos' && view === 'list' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-dourado border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total de produtos', value: products.length, color: 'text-bege' },
                    { label: 'Em estoque', value: stockCount, color: 'text-dourado' },
                    { label: 'Esgotados', value: products.length - stockCount, color: 'text-terracota' },
                    { label: 'Categorias ativas', value: new Set(products.map(p => p.category)).size, color: 'text-bege' },
                  ].map(s => (
                    <div key={s.label} className="bg-marrom-dark border border-bege/10 p-4">
                      <p className="font-body text-xs text-bege/40 mb-1">{s.label}</p>
                      <p className={`font-display text-3xl font-light ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button onClick={openAddForm} className="btn-gold flex items-center justify-center gap-2 text-sm">
                    <Plus size={16} /> Adicionar Novo Produto
                  </button>
                  <input
                    type="text"
                    placeholder="Buscar produto por nome ou material..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 bg-marrom-dark border border-bege/20 text-bege placeholder-bege/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-dourado transition-colors"
                  />
                </div>

                {/* Product list */}
                {visibleProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <Package size={48} className="text-bege/10 mx-auto mb-4" strokeWidth={1} />
                    <p className="font-display text-2xl font-light text-bege/30">
                      {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                    </p>
                    {!searchTerm && (
                      <button onClick={openAddForm} className="mt-4 font-body text-sm text-dourado underline underline-offset-2">
                        Cadastrar o primeiro produto
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleProducts.map(p => (
                      <div key={p.id} className="bg-marrom-dark border border-bege/10 flex items-center gap-4 p-4 hover:border-dourado/30 transition-colors">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-bege/10">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><ImageOff size={18} className="text-bege/20" /></div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-display text-base font-light text-bege leading-tight">{p.name}</h4>
                            {p.badge && <span className="font-body text-[10px] bg-dourado/20 text-dourado px-2 py-0.5 uppercase tracking-wide">{p.badge}</span>}
                          </div>
                          <p className="font-body text-xs text-bege/40 mt-0.5">{p.material} · {CATEGORIES.find(c => c.value === p.category)?.label}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="font-display text-sm font-medium text-dourado">{formatCurrency(p.price)}</span>
                            {p.originalPrice && <span className="font-body text-xs text-bege/30 line-through">{formatCurrency(p.originalPrice)}</span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Stock toggle */}
                          <button
                            onClick={() => handleToggleStock(p.id)}
                            title={p.inStock ? 'Em estoque — clique para marcar como esgotado' : 'Esgotado — clique para marcar como disponível'}
                            className={`flex items-center gap-1.5 font-body text-[10px] font-medium uppercase tracking-wide px-3 py-1.5 border transition-colors ${
                              p.inStock ? 'border-green-700/50 text-green-400 hover:bg-green-900/20' : 'border-terracota/50 text-terracota hover:bg-red-900/20'
                            }`}
                          >
                            {p.inStock ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            {p.inStock ? 'Em estoque' : 'Esgotado'}
                          </button>

                          <button onClick={() => openEditForm(p)} title="Editar produto"
                            className="p-2 text-bege/40 hover:text-dourado border border-transparent hover:border-dourado/30 transition-colors">
                            <Pencil size={16} />
                          </button>

                          <button onClick={() => setConfirmDelete(p.id)} title="Excluir produto"
                            className="p-2 text-bege/40 hover:text-terracota border border-transparent hover:border-terracota/30 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-10 pt-6 border-t border-bege/10 text-center">
                  <p className="font-body text-xs text-bege/25">
                    ✓ Alterações salvas aqui aparecem automaticamente para todos os visitantes do site.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════ FORM: ADD / EDIT ═══════════ */}
        {tab === 'produtos' && view === 'form' && (
          <div>
            {/* Back */}
            <button onClick={cancelForm} className="flex items-center gap-2 text-bege/50 hover:text-bege font-body text-sm mb-6 transition-colors">
              <ArrowLeft size={16} /> Voltar para a lista
            </button>

            <h2 className="font-display text-3xl font-light text-bege mb-8">
              {editingProduct ? '✏️ Editar Produto' : '✨ Novo Produto'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image upload */}
              <div>
                <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-3">
                  📸 Foto do Produto *
                </label>

                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center min-h-72 ${
                    dragOver ? 'border-dourado bg-dourado/10' : 'border-bege/20 hover:border-dourado/50 hover:bg-bege/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
                  />

                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-72 object-cover" />
                      <div className="absolute inset-0 bg-marrom/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <Upload size={24} className="text-bege" />
                        <span className="font-body text-sm text-bege font-medium">Trocar foto</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <Upload size={36} className="text-bege/30 mx-auto mb-4" strokeWidth={1.5} />
                      <p className="font-body text-base text-bege/60 font-medium mb-1">Arraste a foto aqui</p>
                      <p className="font-body text-sm text-bege/35">ou clique para escolher do computador</p>
                      <p className="font-body text-xs text-bege/20 mt-3">JPG, PNG ou WEBP · Máx 10MB</p>
                      <p className="font-body text-xs text-bege/20">A imagem será redimensionada automaticamente</p>
                    </div>
                  )}
                </div>

                {imagePreview && (
                  <button onClick={() => { setImagePreview(''); setImageFile(null); setField('image', ''); }} className="mt-2 flex items-center gap-1 font-body text-xs text-bege/30 hover:text-terracota transition-colors">
                    <X size={12} /> Remover foto
                  </button>
                )}

                {/* Tips */}
                <div className="mt-4 bg-bege/5 border border-bege/10 p-4 space-y-1">
                  <p className="font-body text-xs font-medium text-bege/50 uppercase tracking-wide mb-2">💡 Dicas para boas fotos</p>
                  {['Fundo branco ou neutro fica melhor', 'Foto quadrada (mesmo tamanho nos dois lados)', 'Boa iluminação valoriza o produto', 'Resolução mínima 500×500 pixels'].map(tip => (
                    <p key={tip} className="font-body text-xs text-bege/30">· {tip}</p>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                    placeholder="Ex: Brinco Gota Aurora"
                    className="w-full bg-marrom-dark border border-bege/20 text-bege placeholder-bege/25 font-body text-sm px-4 py-3 focus:outline-none focus:border-dourado transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    rows={3}
                    placeholder="Descreva o produto: material, estilo, ocasião ideal..."
                    className="w-full bg-marrom-dark border border-bege/20 text-bege placeholder-bege/25 font-body text-sm px-4 py-3 focus:outline-none focus:border-dourado transition-colors resize-none"
                  />
                </div>

                {/* Price row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">Preço de Venda *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-bege/40">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price || ''}
                        onChange={e => setField('price', parseFloat(e.target.value) || 0)}
                        placeholder="89,90"
                        className="w-full bg-marrom-dark border border-bege/20 text-bege placeholder-bege/25 font-body text-sm pl-9 pr-4 py-3 focus:outline-none focus:border-dourado transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">
                      Preço Original <span className="text-bege/30 lowercase normal-case">(p/ mostrar desconto)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-bege/40">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.originalPrice || ''}
                        onChange={e => setField('originalPrice', parseFloat(e.target.value) || undefined)}
                        placeholder="Opcional"
                        className="w-full bg-marrom-dark border border-bege/20 text-bege placeholder-bege/25 font-body text-sm pl-9 pr-4 py-3 focus:outline-none focus:border-dourado transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Category + Material type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">Categoria *</label>
                    <select
                      value={form.category}
                      onChange={e => setField('category', e.target.value as Category)}
                      className="w-full bg-marrom-dark border border-bege/20 text-bege font-body text-sm px-4 py-3 focus:outline-none focus:border-dourado transition-colors cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">Material *</label>
                    <select
                      value={form.materialType}
                      onChange={e => setField('materialType', e.target.value as MaterialType)}
                      className="w-full bg-marrom-dark border border-bege/20 text-bege font-body text-sm px-4 py-3 focus:outline-none focus:border-dourado transition-colors cursor-pointer"
                    >
                      {MATERIAL_TYPES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Material description */}
                <div>
                  <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">
                    Descrição do Material * <span className="text-bege/30 lowercase normal-case">(aparece no card)</span>
                  </label>
                  <input
                    type="text"
                    value={form.material}
                    onChange={e => setField('material', e.target.value)}
                    placeholder="Ex: Semi-joia banhada a ouro 18k"
                    className="w-full bg-marrom-dark border border-bege/20 text-bege placeholder-bege/25 font-body text-sm px-4 py-3 focus:outline-none focus:border-dourado transition-colors"
                  />
                </div>

                {/* Badge + Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2 flex items-center gap-1">
                      <Tag size={11} /> Etiqueta
                    </label>
                    <select
                      value={form.badge ?? ''}
                      onChange={e => setField('badge', (e.target.value || undefined) as Product['badge'])}
                      className="w-full bg-marrom-dark border border-bege/20 text-bege font-body text-sm px-4 py-3 focus:outline-none focus:border-dourado transition-colors cursor-pointer"
                    >
                      {BADGES.map(b => <option key={b} value={b}>{b || '— Sem etiqueta —'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium tracking-widest2 uppercase text-bege/50 block mb-2">Disponibilidade</label>
                    <button
                      onClick={() => setField('inStock', !form.inStock)}
                      className={`w-full flex items-center justify-center gap-2 font-body text-sm font-medium px-4 py-3 border transition-colors ${
                        form.inStock ? 'border-green-700/50 text-green-400 bg-green-900/10 hover:bg-green-900/20' : 'border-terracota/50 text-terracota bg-red-900/10 hover:bg-red-900/20'
                      }`}
                    >
                      {form.inStock ? <><ToggleRight size={18} /> Em estoque</> : <><ToggleLeft size={18} /> Esgotado</>}
                    </button>
                  </div>
                </div>

                {/* Save */}
                <div className="flex gap-3 pt-2">
                  <button onClick={cancelForm} className="flex-1 btn-ghost text-xs py-3">Cancelar</button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 btn-gold flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-60"
                  >
                    {saving ? (
                      <><div className="w-4 h-4 border-2 border-marrom-dark border-t-transparent rounded-full animate-spin" /> {imageLoading ? 'Enviando foto...' : 'Salvando...'}</>
                    ) : (
                      <><Save size={16} /> {editingProduct ? 'Salvar alterações' : 'Cadastrar produto'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ TAB: CALCULADORA ═══════════ */}
        {tab === 'calculadora' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-bege p-8 shadow-soft-lg space-y-6">
              <h2 className="font-display text-xl font-light text-marrom flex items-center gap-2">
                <Package size={18} className="text-dourado" /> Custos do Produto
              </h2>
              {[
                { label: 'Custo da Embalagem + Tag', field: 'packagingCost' as const },
                { label: 'Preço de Custo da Peça', field: 'pieceCost' as const },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-2">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-marrom/50">R$</span>
                    <input type="number" step="0.01" min="0" value={pricing[field] || ''} onChange={e => setPricing(p => ({ ...p, [field]: parseFloat(e.target.value) || 0 }))} placeholder="0,00" className="input-field pl-9" />
                  </div>
                </div>
              ))}
              <div className="border border-nude p-4 bg-bege-50 flex items-center justify-between">
                <span className="font-body text-xs tracking-widest2 uppercase text-marrom/50">Custo Total Unitário</span>
                <span className="font-display text-xl font-medium text-marrom">{formatCurrency(pricingResult.totalCost)}</span>
              </div>
              <div>
                <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-3 flex items-center gap-2">
                  <TrendingUp size={12} /> Markup Desejado
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[50, 100, 150, 200, 300].map(p => (
                    <button key={p} onClick={() => setPricing(prev => ({ ...prev, markup: p }))} className={`font-body text-xs font-medium px-3 py-1.5 border transition-all ${pricing.markup === p ? 'bg-marrom text-bege border-marrom' : 'border-nude text-marrom hover:border-marrom/50'}`}>{p}%</button>
                  ))}
                </div>
                <div className="relative">
                  <input type="number" step="1" min="1" value={pricing.markup || ''} onChange={e => setPricing(p => ({ ...p, markup: parseFloat(e.target.value) || 0 }))} className="input-field pr-10" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-sm text-marrom/50">%</span>
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-2">Quantidade de Peças</label>
                <input type="number" step="1" min="1" value={pricing.quantity || ''} onChange={e => setPricing(p => ({ ...p, quantity: Math.max(1, parseInt(e.target.value) || 1) }))} className="input-field" />
              </div>
              <button onClick={() => setPricing(INITIAL_PRICING)} className="btn-ghost w-full flex items-center justify-center gap-2 text-xs">
                <RotateCcw size={13} /> Resetar
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-light text-bege flex items-center gap-2">
                <DollarSign size={18} className="text-dourado" /> Resultado
              </h2>
              {(pricingResult.totalCost > 0) ? (
                <>
                  <div className="p-5 border border-dourado bg-dourado/10">
                    <p className="font-body text-xs tracking-widest2 uppercase text-marrom/50 mb-1">Preço de Venda Sugerido</p>
                    <p className="font-display text-3xl font-medium text-marrom">{formatCurrency(pricingResult.suggestedPrice)}</p>
                    <p className="font-body text-xs text-marrom/40 mt-1">Com markup de {pricing.markup}%</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-5 border border-nude bg-white">
                      <p className="font-body text-xs tracking-widest2 uppercase text-marrom/50 mb-1">Lucro por Peça</p>
                      <p className="font-display text-2xl font-medium text-marrom">{formatCurrency(pricingResult.profit)}</p>
                    </div>
                    <div className="p-5 border border-nude bg-white">
                      <p className="font-body text-xs tracking-widest2 uppercase text-marrom/50 mb-1">Margem de Lucro</p>
                      <p className={`font-display text-2xl font-medium ${pricingResult.margin >= 50 ? 'text-green-600' : pricingResult.margin >= 30 ? 'text-dourado-dark' : 'text-terracota'}`}>{pricingResult.margin.toFixed(1)}%</p>
                    </div>
                  </div>
                  {pricing.quantity > 1 && (
                    <div className="bg-bege p-5 border border-dourado/20 grid grid-cols-2 gap-4">
                      <div><p className="font-body text-xs text-marrom/50 mb-0.5">Receita Total</p><p className="font-display text-lg font-medium text-marrom">{formatCurrency(pricingResult.totalRevenue)}</p></div>
                      <div><p className="font-body text-xs text-marrom/50 mb-0.5">Lucro Total</p><p className="font-display text-lg font-medium text-marrom">{formatCurrency(pricingResult.totalProfit)}</p></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Calculator size={40} className="text-bege/10 mb-4" strokeWidth={1} />
                  <p className="font-display text-xl font-light text-bege/30">Preencha os custos para calcular</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
