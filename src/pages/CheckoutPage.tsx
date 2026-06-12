import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, CreditCard, MessageSquare, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { OrderForm } from '../types';
import { formatPhone, formatCEP } from '../utils/formatters';
import { formatCurrency } from '../utils/formatters';
import { fetchAddressByCEP } from '../utils/cep';
import { sendOrderToWhatsApp } from '../utils/whatsapp';

const PAYMENT_OPTIONS = [
  { value: 'pix', label: 'PIX', desc: 'Pagamento instantâneo' },
  { value: 'credit_card', label: 'Cartão de Crédito', desc: 'À vista' },
  { value: 'installments', label: 'Cartão Parcelado', desc: 'Combinar parcelas via WhatsApp' },
  { value: 'bank_transfer', label: 'Transferência', desc: 'TED / DOC' },
];

const INITIAL_FORM: OrderForm = {
  name: '', email: '', phone: '',
  deliveryMethod: 'pickup',
  cep: '', street: '', number: '', complement: '',
  neighborhood: '', city: '', state: '',
  paymentMethod: 'pix', notes: '',
};

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<OrderForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (items.length === 0) navigate('/');
  }, [items, navigate]);

  const set = (field: keyof OrderForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleCEP = async (raw: string) => {
    const formatted = formatCEP(raw);
    set('cep', formatted);
    setCepError('');
    if (raw.replace(/\D/g, '').length === 8) {
      setCepLoading(true);
      const data = await fetchAddressByCEP(raw);
      setCepLoading(false);
      if (data) {
        setForm(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          complement: data.complemento || prev.complement,
        }));
      } else {
        setCepError('CEP não encontrado. Preencha o endereço manualmente.');
      }
    }
  };

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Nome obrigatório';
    if (!form.email.includes('@')) e.email = 'E-mail inválido';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    if (form.deliveryMethod === 'pickup') return true;
    const e: typeof errors = {};
    if (!form.cep || form.cep.replace(/\D/g, '').length !== 8) e.cep = 'CEP inválido';
    if (!form.street.trim()) e.street = 'Logradouro obrigatório';
    if (!form.number.trim()) e.number = 'Número obrigatório';
    if (!form.neighborhood.trim()) e.neighborhood = 'Bairro obrigatório';
    if (!form.city.trim()) e.city = 'Cidade obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    if (!form.paymentMethod) {
      setErrors({ paymentMethod: 'Selecione uma forma de pagamento' });
      return;
    }
    sendOrderToWhatsApp(items, form, subtotal);
    clearCart();
    navigate('/');
  };

  const inputClass = (field: keyof OrderForm) =>
    `input-field ${errors[field] ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`;

  const steps = ['Dados pessoais', 'Entrega', 'Pagamento'];

  return (
    <div className="min-h-screen bg-bege bg-texture py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => step === 1 ? navigate(-1) : setStep(s => (s - 1) as 1 | 2 | 3)}
          className="flex items-center gap-2 text-marrom/60 hover:text-marrom text-sm font-body mb-8 transition-colors"
        >
          <ChevronLeft size={16} />
          {step === 1 ? 'Voltar ao catálogo' : 'Etapa anterior'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form column */}
          <div className="lg:col-span-2">
            {/* Step indicator */}
            <div className="flex items-center mb-8">
              {steps.map((label, i) => {
                const n = (i + 1) as 1 | 2 | 3;
                const done = step > n;
                const active = step === n;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-medium border transition-all duration-300 ${
                          done ? 'bg-dourado border-dourado text-marrom-dark'
                            : active ? 'bg-marrom border-marrom text-bege'
                            : 'border-nude text-nude'
                        }`}
                      >
                        {done ? '✓' : n}
                      </div>
                      <span className={`font-body text-xs tracking-wide hidden sm:block ${active ? 'text-marrom font-medium' : 'text-marrom/40'}`}>
                        {label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-px mx-3 transition-colors duration-300 ${done ? 'bg-dourado/60' : 'bg-nude/60'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* STEP 1 — Personal data */}
            {step === 1 && (
              <div className="bg-white p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <User size={20} className="text-dourado" />
                  <h2 className="font-display text-2xl font-light text-marrom">Dados Pessoais</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => set('phone', formatPhone(e.target.value))}
                      placeholder="(21) 99999-9999"
                      className={inputClass('phone')}
                      maxLength={15}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">E-mail *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="seu@email.com"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <button onClick={handleNext} className="btn-primary mt-8 w-full flex items-center justify-center gap-2">
                  Continuar <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* STEP 2 — Delivery */}
            {step === 2 && (
              <div className="bg-white p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={20} className="text-dourado" />
                  <h2 className="font-display text-2xl font-light text-marrom">Entrega</h2>
                </div>

                {/* Delivery method */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { value: 'pickup', label: 'Retirada', desc: 'Combinar local via WhatsApp' },
                    { value: 'delivery', label: 'Entrega', desc: 'Frete a combinar' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => set('deliveryMethod', opt.value)}
                      className={`p-4 border text-left transition-all duration-200 ${
                        form.deliveryMethod === opt.value
                          ? 'border-marrom bg-marrom/5'
                          : 'border-nude hover:border-marrom/40'
                      }`}
                    >
                      <p className="font-body text-sm font-medium text-marrom">{opt.label}</p>
                      <p className="font-body text-xs text-marrom/50 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {form.deliveryMethod === 'delivery' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">CEP *</label>
                      <input
                        type="text"
                        value={form.cep}
                        onChange={e => handleCEP(e.target.value)}
                        placeholder="00000-000"
                        className={inputClass('cep')}
                        maxLength={9}
                      />
                      {cepLoading && (
                        <Loader2 size={15} className="absolute right-3 top-9 text-dourado animate-spin" />
                      )}
                      {(errors.cep || cepError) && (
                        <p className="text-red-500 text-xs mt-1">{errors.cep || cepError}</p>
                      )}
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">Estado</label>
                      <input type="text" value={form.state} onChange={e => set('state', e.target.value)} placeholder="RJ" className={inputClass('state')} maxLength={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">Logradouro *</label>
                      <input type="text" value={form.street} onChange={e => set('street', e.target.value)} placeholder="Rua, Avenida..." className={inputClass('street')} />
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">Número *</label>
                      <input type="text" value={form.number} onChange={e => set('number', e.target.value)} placeholder="123" className={inputClass('number')} />
                      {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">Complemento</label>
                      <input type="text" value={form.complement} onChange={e => set('complement', e.target.value)} placeholder="Apto, Bloco..." className="input-field" />
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">Bairro *</label>
                      <input type="text" value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} placeholder="Bairro" className={inputClass('neighborhood')} />
                      {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 block mb-1.5">Cidade *</label>
                      <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Cidade" className={inputClass('city')} />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                  </div>
                )}

                {form.deliveryMethod === 'pickup' && (
                  <div className="bg-dourado/10 border border-dourado/30 p-4 mt-2">
                    <p className="font-body text-sm text-marrom/80 leading-relaxed">
                      📍 Ao confirmar o pedido, entraremos em contato via WhatsApp para combinar o local e horário de retirada. 💛
                    </p>
                  </div>
                )}

                <button onClick={handleNext} className="btn-primary mt-8 w-full flex items-center justify-center gap-2">
                  Continuar <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* STEP 3 — Payment */}
            {step === 3 && (
              <div className="bg-white p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard size={20} className="text-dourado" />
                  <h2 className="font-display text-2xl font-light text-marrom">Forma de Pagamento</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {PAYMENT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => set('paymentMethod', opt.value)}
                      className={`p-4 border text-left transition-all duration-200 ${
                        form.paymentMethod === opt.value
                          ? 'border-marrom bg-marrom/5'
                          : 'border-nude hover:border-marrom/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-body text-sm font-medium text-marrom">{opt.label}</p>
                        {form.paymentMethod === opt.value && (
                          <div className="w-4 h-4 rounded-full bg-dourado flex items-center justify-center">
                            <span className="text-marrom-dark text-[10px]">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="font-body text-xs text-marrom/50">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-xs mb-4">{errors.paymentMethod}</p>}

                {/* Observations */}
                <div>
                  <label className="font-body text-xs tracking-widest2 uppercase text-marrom/60 flex items-center gap-2 mb-1.5">
                    <MessageSquare size={13} />
                    Observações (opcional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    rows={3}
                    placeholder="Algum recado especial para o pedido?"
                    className="input-field resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="btn-gold mt-8 w-full flex items-center justify-center gap-2 text-sm"
                >
                  ✓ Enviar Pedido pelo WhatsApp
                </button>
                <p className="font-body text-xs text-marrom/40 text-center mt-3">
                  Você será direcionada para o WhatsApp para confirmar o pedido.
                </p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-soft p-6 sticky top-24">
              <h3 className="font-display text-xl font-light text-marrom mb-5">Resumo do Pedido</h3>
              <div className="space-y-3 mb-5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover flex-shrink-0"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/56x56/EAE2D3/5A3E2B?text=A'; }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-xs font-medium text-marrom truncate">{product.name}</p>
                      <p className="font-body text-xs text-marrom/40">x{quantity}</p>
                      <p className="font-display text-sm font-medium text-marrom">
                        {formatCurrency(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-nude/60 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-marrom/60">Subtotal</span>
                  <span className="font-body text-sm text-marrom">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-marrom/60">Frete</span>
                  <span className="font-body text-sm text-dourado">A combinar</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-nude/60 mt-2">
                  <span className="font-display text-lg font-medium text-marrom">Total</span>
                  <span className="font-display text-lg font-medium text-marrom">{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
