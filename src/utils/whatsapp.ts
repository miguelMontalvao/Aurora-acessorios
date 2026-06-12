import type { CartItem, OrderForm } from '../types';
import { formatCurrency } from './formatters';

const WHATSAPP_NUMBER = '5521997569522';

const paymentLabels: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  installments: 'Cartão de Crédito Parcelado',
  bank_transfer: 'Transferência Bancária',
};

export const buildOrderMessage = (items: CartItem[], form: OrderForm, subtotal: number): string => {
  const itemsBlock = items
    .map(
      ({ product, quantity }) =>
        `  • ${product.name} (x${quantity}) — ${formatCurrency(product.price * quantity)}`
    )
    .join('\n');

  const deliveryBlock =
    form.deliveryMethod === 'pickup'
      ? '📍 *Retirada em mãos* (combinar local e horário)'
      : `🚚 *Entrega*\n  ${form.street}, ${form.number}${form.complement ? ` — ${form.complement}` : ''}\n  ${form.neighborhood} — ${form.city}/${form.state}\n  CEP: ${form.cep}`;

  const notesBlock = form.notes?.trim()
    ? `\n📝 *Observações*\n  ${form.notes}`
    : '';

  const message = `
🛍️ *NOVO PEDIDO — AURORA ACESSÓRIOS*
━━━━━━━━━━━━━━━━━━━━━━

👤 *DADOS DO CLIENTE*
  Nome: ${form.name}
  Telefone: ${form.phone}
  E-mail: ${form.email}

📦 *ENTREGA*
  ${deliveryBlock}

🧾 *ITENS DO PEDIDO*
${itemsBlock}

💰 *RESUMO FINANCEIRO*
  Subtotal: ${formatCurrency(subtotal)}
  Frete: A combinar
  *TOTAL: ${formatCurrency(subtotal)}*

💳 *FORMA DE PAGAMENTO*
  ${paymentLabels[form.paymentMethod] || form.paymentMethod}
${notesBlock}
━━━━━━━━━━━━━━━━━━━━━━
Olá! Acabei de fazer meu pedido pelo site. ✨
`.trim();

  return message;
};

export const sendOrderToWhatsApp = (items: CartItem[], form: OrderForm, subtotal: number): void => {
  const message = buildOrderMessage(items, form, subtotal);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
