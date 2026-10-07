import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { PaymentMethod, DeliveryAddress } from '../../types/food';
import { calculateOrderPrice } from '../../services/pricingService';
import { apiClient } from '../../services/apiClient';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  CheckCircle2,
  Award,
  ArrowRight,
  ShieldCheck,
  Plus,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cartItems,
    appliedCoupon,
    deliveryType,
    deliveryFeeSetting,
    freeDeliveryThreshold,
    selectedAddress,
    userAddresses,
    setSelectedAddress,
    addAddress,
    createOrder,
    processSecurePaymentCheckout,
    showToast
  } = useMermiStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Modal de Pagamento Mercado Pago
  const [activePaymentModal, setActivePaymentModal] = useState<{
    orderId: string;
    total: number;
    method: 'pix' | 'cartao_credito' | 'debit_card';
    payment?: any;
    pix?: any;
    card?: any;
  } | null>(null);

  // Formulário de novo endereço
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [cep, setCep] = useState('');

  if (!isOpen) return null;

  const priceCalc = calculateOrderPrice(
    cartItems,
    appliedCoupon,
    deliveryType,
    deliveryFeeSetting,
    freeDeliveryThreshold
  );

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !number.trim() || !neighborhood.trim()) {
      showToast('Por favor preencha rua, número e bairro.');
      return;
    }
    const newAddr: Omit<DeliveryAddress, 'id'> = {
      recipientName: 'Cliente MerMi',
      street: street.trim(),
      number: number.trim(),
      complement: complement.trim() || undefined,
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: cep.trim() || '01310-100',
      isDefault: true
    };
    addAddress(newAddr);
    setIsAddingNewAddress(false);
  };

  const handleFinishOrder = async () => {
    if (cartItems.length === 0) {
      showToast('Seu carrinho está vazio.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Criar pedido real no Cloud SQL (Regras #4, #5, #6: Preço calculado autoritativamente no backend e status inicial PENDING_PAYMENT)
      const orderRes = await apiClient.orders.create({
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          line: item.line,
          size: item.size,
          quantity: item.quantity,
          customization: item.customMarmita,
        })),
        address: {
          recipientName: selectedAddress.recipientName || 'Cliente MerMi',
          street: selectedAddress.street,
          number: selectedAddress.number,
          complement: selectedAddress.complement,
          neighborhood: selectedAddress.neighborhood,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
        },
        deliveryType,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        notes: orderNotes.trim() || undefined,
      });

      if (!orderRes.success || !orderRes.orderId) {
        showToast(orderRes.message || 'Erro ao registrar pedido no servidor.');
        setIsSubmitting(false);
        return;
      }

      const createdOrderId = orderRes.orderId;
      const orderTotal = Number(orderRes.total || priceCalc.total);

      // 2. Chamar o gateway Mercado Pago para inicializar a cobrança (Regras #7, #8, #9)
      const methodKey = paymentMethod === 'pix' ? 'pix' : 'credit_card';
      const payRes = await apiClient.payments.create({
        orderId: createdOrderId,
        method: methodKey,
        payer: {
          name: selectedAddress.recipientName || 'Cliente MerMi',
          email: 'cliente@mermifitlife.com.br',
        },
      });

      setIsSubmitting(false);

      // 3. Abrir o Modal Oficial de Pagamento com dados do Gateway
      setActivePaymentModal({
        orderId: createdOrderId,
        total: orderTotal,
        method: paymentMethod as any,
        payment: payRes.payment,
        pix: payRes.pix,
        card: payRes.card,
      });
    } catch (err: any) {
      setIsSubmitting(false);
      showToast('Erro ao processar pedido: ' + (err.error || err.message));
    }
  };

  const pixKey = 'financeiro@mermifitlife.com.br';

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    showToast('Chave PIX copiada para a área de transferência!');
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FBF7EE] w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A]">
              ETAPA FINAL • CHECKOUT SEGURO
            </span>
            <h2 className="text-lg sm:text-xl font-black font-['Outfit'] mt-0.5">
              Confirmar Pedido
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-stone-800 text-xs">
          
          {/* Seção 1: Endereço de Entrega */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-stone-900 font-['Outfit'] uppercase flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-[#0EB24A]" />
                {deliveryType === 'entrega' ? 'Endereço de Entrega' : 'Local de Retirada'}
              </span>

              {deliveryType === 'entrega' && !isAddingNewAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-[11px] font-bold text-[#0EB24A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Novo Endereço
                </button>
              )}
            </div>

            {deliveryType === 'retirada' ? (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700">
                <p className="font-bold text-stone-900">Unidade Central MerMi Fit Life</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Av. Paulista, 1000 - Bela Vista, São Paulo - SP</p>
                <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                  Disponível para retirada em 30 minutos após aprovação
                </span>
              </div>
            ) : isAddingNewAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-2 pt-2 border-t border-stone-100">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-stone-500 block">Rua / Avenida</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rua das Palmeiras"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-stone-200 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block">Número</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-stone-200 bg-stone-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block">Bairro</label>
                    <input
                      type="text"
                      required
                      placeholder="Jardins"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-stone-200 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto 42"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-stone-200 bg-stone-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 text-[11px] font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#0EB24A] text-white text-[11px] font-bold cursor-pointer"
                  >
                    Salvar Endereço
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-1.5">
                {userAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedAddress.id === addr.id
                        ? 'border-[#0EB24A] bg-emerald-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">{addr.recipientName || 'Endereço'}</span>
                        {addr.isDefault && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-stone-200 text-stone-700">
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {addr.street}, {addr.number} {addr.complement ? `- ${addr.complement}` : ''} · {addr.neighborhood}, {addr.city}
                      </p>
                    </div>

                    {selectedAddress.id === addr.id && (
                      <div className="w-4 h-4 rounded-full bg-[#0EB24A] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção 2: Forma de Pagamento */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <span className="font-black text-stone-900 font-['Outfit'] uppercase flex items-center gap-1.5 text-xs">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Forma de Pagamento
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                  paymentMethod === 'pix'
                    ? 'border-[#0EB24A] bg-emerald-50/50 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  paymentMethod === 'pix' ? 'bg-[#0EB24A] text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-stone-900 block font-['Outfit']">PIX Instantâneo</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Aprovação imediata</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_credito')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                  paymentMethod === 'cartao_credito'
                    ? 'border-[#0EB24A] bg-emerald-50/50 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  paymentMethod === 'cartao_credito' ? 'bg-[#0EB24A] text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-stone-900 block font-['Outfit']">Cartão</span>
                  <span className="text-[10px] text-stone-500 font-semibold">Crédito ou Débito</span>
                </div>
              </button>
            </div>

            {/* Instruções do PIX */}
            {paymentMethod === 'pix' && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="text-[11px] font-bold">Chave PIX Oficial (E-mail):</span>
                  <span className="font-mono text-[11px] font-bold text-stone-900">{pixKey}</span>
                </div>
                <button
                  type="button"
                  onClick={copyPixCode}
                  className="w-full py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center gap-1.5 text-[11px] font-black text-stone-800 transition-colors cursor-pointer"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Chave Copiada!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar Chave PIX
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Seção 3: Resumo dos Itens & Financeiro */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <span className="font-black text-stone-900 font-['Outfit'] uppercase block text-xs">
              Resumo do Pedido ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})
            </span>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-[11px] py-1 border-b border-stone-100 last:border-0">
                  <div className="max-w-[75%]">
                    <span className="font-bold text-stone-900">{item.quantity}x {item.name}</span>
                    <p className="text-[10px] text-stone-400 line-clamp-1">{item.summary}</p>
                  </div>
                  <span className="font-black text-stone-900 font-['Outfit']">
                    R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Linhas de Fechamento */}
            <div className="pt-2 border-t border-stone-200 space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal dos Pratos:</span>
                <span>R$ {priceCalc.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {priceCalc.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto Cupom ({appliedCoupon?.code}):</span>
                  <span>- R$ {priceCalc.discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Taxa de Entrega:</span>
                <span>
                  {priceCalc.deliveryFee === 0 ? (
                    <strong className="text-emerald-600 uppercase">Grátis</strong>
                  ) : (
                    `R$ ${priceCalc.deliveryFee.toFixed(2).replace('.', ',')}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm font-black text-stone-950 font-['Outfit'] pt-2 border-t border-stone-200">
                <span>Total a Pagar:</span>
                <span className="text-lg text-[#0EB24A]">
                  R$ {priceCalc.total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900 mt-2">
                <span className="flex items-center gap-1 font-bold text-[11px]">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> Points creditados após confirmação:
                </span>
                <span className="font-black text-xs">+{priceCalc.pointsEarned} MerMi Points</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white p-4 sm:p-5 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-black uppercase tracking-wider text-stone-600 hover:bg-stone-50 cursor-pointer"
          >
            Voltar
          </button>

          <button
            onClick={handleFinishOrder}
            disabled={isSubmitting || cartItems.length === 0}
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#0EB24A] hover:bg-emerald-600 active:scale-95 text-white flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 ml-auto"
          >
            {isSubmitting ? (
              'Confirmando...'
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Finalizar Pedido
              </>
            )}
          </button>
        </div>

      </div>

      {activePaymentModal && (
        <PaymentGatewayModal
          isOpen={Boolean(activePaymentModal)}
          orderId={activePaymentModal.orderId}
          total={activePaymentModal.total}
          method={activePaymentModal.method}
          initialPayment={activePaymentModal.payment}
          initialPix={activePaymentModal.pix}
          initialCard={activePaymentModal.card}
          onClose={() => {
            setActivePaymentModal(null);
            onClose();
          }}
          onPaymentSuccess={(confirmedOrderId) => {
            setActivePaymentModal(null);
            onOrderSuccess(confirmedOrderId);
            onClose();
          }}
        />
      )}
    </div>
  );
};
