import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ShieldCheck,
  ArrowRight,
  Truck,
  RotateCcw
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useMermiStore } from '../../context/MermiStoreContext';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  orderId: string;
  total: number;
  method: 'pix' | 'cartao_credito' | 'debit_card';
  initialPayment?: any;
  initialPix?: {
    qrCode: string;
    qrCodeBase64?: string;
    copyPaste: string;
    expiresAt: string;
    ticketUrl?: string;
  };
  initialCard?: {
    lastFour?: string;
    brand?: string;
    installments?: number;
  };
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  orderId,
  total,
  method,
  initialPayment,
  initialPix,
  initialCard,
  onClose,
  onPaymentSuccess
}) => {
  const { showToast, clearCart } = useMermiStore();

  const [payment, setPayment] = useState<any>(initialPayment || null);
  const [pixData, setPixData] = useState<any>(initialPix || null);
  const [cardData, setCardData] = useState<any>(initialCard || null);

  const [paymentStatus, setPaymentStatus] = useState<
    'PAYMENT_PENDING' | 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED' | 'PAYMENT_CANCELLED' | 'PAYMENT_EXPIRED'
  >('PAYMENT_PENDING');
  const [statusDetail, setStatusDetail] = useState<string>('pending_payment');

  const [copiedPix, setCopiedPix] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos

  // Formulário do Cartão
  const [cardHolder, setCardHolder] = useState('');
  const [cardCpf, setCardCpf] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);
  const [submittingCard, setSubmittingCard] = useState(false);

  // Inicializar estado quando modal abrir
  useEffect(() => {
    if (initialPayment) {
      setPayment(initialPayment);
      setPaymentStatus(initialPayment.status || 'PAYMENT_PENDING');
    }
    if (initialPix) setPixData(initialPix);
    if (initialCard) setCardData(initialCard);
  }, [initialPayment, initialPix, initialCard]);

  // Contagem regressiva de expiração do Pix
  useEffect(() => {
    if (!isOpen || paymentStatus !== 'PAYMENT_PENDING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('PAYMENT_EXPIRED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentStatus]);

  // Polling em tempo real para verificar webhook no servidor (Regra #15: O frontend consulta o backend)
  useEffect(() => {
    if (!isOpen || paymentStatus === 'PAYMENT_APPROVED' || paymentStatus === 'PAYMENT_CANCELLED') return;

    const checkInterval = setInterval(async () => {
      try {
        const queryId = payment?.id || orderId;
        const res = await apiClient.payments.getStatus(queryId);

        if (res && res.payment) {
          const currentStatus = res.payment.status;
          setPaymentStatus(currentStatus);
          setStatusDetail(res.payment.statusDetail || '');

          if (currentStatus === 'PAYMENT_APPROVED') {
            clearInterval(checkInterval);
            clearCart();
            showToast('Pagamento confirmado com sucesso pelo Mercado Pago!');
            onPaymentSuccess(orderId);
          }
        }
      } catch (err) {
        // Ignora erros temporários de rede no polling
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [isOpen, payment, orderId, paymentStatus]);

  if (!isOpen) return null;

  // Verificação manual pelo botão
  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const queryId = payment?.id || orderId;
      const res = await apiClient.payments.getStatus(queryId);
      if (res && res.payment) {
        setPaymentStatus(res.payment.status);
        setStatusDetail(res.payment.statusDetail || '');
        if (res.payment.status === 'PAYMENT_APPROVED') {
          clearCart();
          showToast('Pagamento confirmado!');
          onPaymentSuccess(orderId);
        } else {
          showToast('Status atual: ' + res.payment.status.replace('PAYMENT_', ''));
        }
      }
    } catch (err: any) {
      showToast('Erro ao consultar status: ' + err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopyPix = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopiedPix(true);
      showToast('Código Pix Copia e Cola copiado com sucesso!');
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  // Submissão do Cartão no Gateway (Regra #9: Não armazena dados sensíveis do cartão no banco MERMI)
  const handleSubmitCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder) {
      showToast('Preencha todos os campos do cartão.');
      return;
    }

    setSubmittingCard(true);
    try {
      const cleanNum = cardNumber.replace(/\D/g, '');
      const lastFour = cleanNum.slice(-4);
      const brand = cleanNum.startsWith('4') ? 'visa' : cleanNum.startsWith('5') ? 'master' : 'elo';

      const res = await apiClient.payments.create({
        orderId,
        method: 'credit_card',
        payer: {
          name: cardHolder,
          cpf: cardCpf.replace(/\D/g, ''),
          email: 'cliente@mermifitlife.com.br',
        },
        cardDetails: {
          lastFour,
          brand,
          installments,
          holderName: cardHolder,
          token: `tok_sim_${Date.now()}_${lastFour}`,
        },
      });

      if (res.success && res.payment) {
        setPayment(res.payment);
        setCardData(res.card || { lastFour, brand, installments });
        setPaymentStatus(res.payment.status);
        showToast('Cartão enviado para processamento no Mercado Pago!');
      } else {
        showToast('Erro ao processar cartão: ' + (res.message || 'Tente novamente.'));
      }
    } catch (err: any) {
      showToast('Erro ao enviar pagamento: ' + (err.error || err.message));
    } finally {
      setSubmittingCard(false);
    }
  };

  const formatMinutes = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-['Outfit']">
      <div className="bg-[#171E31] text-white w-full max-w-lg rounded-3xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Oficial do Gateway */}
        <div className="bg-stone-900/90 p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0EB24A]/20 border border-[#0EB24A]/40 flex items-center justify-center text-[#0EB24A]">
              {method === 'pix' ? <QrCode size={22} /> : <CreditCard size={22} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                  Mercado Pago Gateway
                </span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={11} /> 100% Seguro
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black mt-0.5">
                Pedido #{orderId}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conteúdo Dinâmico conforme o Estado do Pagamento */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* 1. SE O PAGAMENTO FOI APROVADO (Regra #14: Página de Resultado Aprovado) */}
          {paymentStatus === 'PAYMENT_APPROVED' && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-[#0EB24A] shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={44} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0EB24A]">
                  Confirmação em Tempo Real
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Pagamento confirmado!
                </h3>
                <p className="text-stone-300 text-xs mt-1 max-w-sm mx-auto">
                  Seu pedido foi recebido pela MerMi Fit Life e já foi encaminhado para a equipe de produção.
                </p>
              </div>

              {/* Detalhes do Pedido Aprovado */}
              <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 text-left space-y-2.5 max-w-sm mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                  <span className="text-stone-400 font-bold">Número do Pedido:</span>
                  <span className="font-mono font-bold text-white text-sm">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                  <span className="text-stone-400 font-bold">Valor Autorizado:</span>
                  <span className="font-black text-[#0EB24A] text-base">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                  <span className="text-stone-400 font-bold">Forma de Pagamento:</span>
                  <span className="font-bold text-stone-200 uppercase">{method === 'pix' ? 'Pix Instantâneo' : 'Cartão'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-bold">Previsão de Entrega:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Truck size={13} /> 35 a 45 minutos
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onPaymentSuccess(orderId);
                }}
                className="w-full max-w-sm mx-auto py-3 bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Acompanhar Meu Pedido
              </button>
            </div>
          )}

          {/* 2. SE O PAGAMENTO ESTÁ PENDENTE (Regra #8 Pix ou Cartão Processando) */}
          {paymentStatus === 'PAYMENT_PENDING' && (
            <div className="space-y-4">
              
              {/* Valor e Alerta de Status */}
              <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 font-bold block uppercase tracking-wider">
                    Total Autorizado pelo Backend:
                  </span>
                  <span className="text-2xl font-black text-[#0EB24A]">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <RefreshCw size={11} className="animate-spin" /> Aguardando Pagamento
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Expira em: <strong className="text-stone-200">{formatMinutes(timeLeft)}</strong>
                  </span>
                </div>
              </div>

              {/* SE FOR PIX (Regra #8) */}
              {method === 'pix' && pixData && (
                <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-4 text-center">
                  <div>
                    <h4 className="font-bold text-sm text-white">Escaneie o QR Code no seu App do Banco</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Abra o aplicativo onde tem o Pix cadastrado e selecione &quot;Ler QR Code&quot; ou use o código abaixo.
                    </p>
                  </div>

                  {/* Render do QR Code */}
                  <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-md border border-stone-700 flex items-center justify-center">
                    {pixData.qrCodeBase64 ? (
                      <img
                        src={pixData.qrCodeBase64}
                        alt="QR Code Pix"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-stone-800 text-center font-mono text-[10px]">
                        <QrCode size={120} className="mx-auto text-stone-900" />
                        <span className="block mt-1">Pix Mercado Pago</span>
                      </div>
                    )}
                  </div>

                  {/* Pix Copia e Cola */}
                  <div className="space-y-2 text-left">
                    <span className="text-[11px] font-bold text-stone-300 block">
                      Código Pix Copia e Cola:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixData.copyPaste}
                        className="w-full bg-stone-950 text-stone-400 text-[11px] font-mono p-2.5 rounded-xl border border-stone-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="px-3.5 py-2.5 bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                      >
                        {copiedPix ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SE FOR CARTÃO (Regra #9) E AINDA NÃO SUBMETIDO */}
              {method !== 'pix' && !payment && (
                <form onSubmit={handleSubmitCardPayment} className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <CreditCard className="text-[#0EB24A]" size={16} />
                    Dados do Cartão no Mercado Pago
                  </h4>

                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      required
                      placeholder="Como impresso no cartão"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">CPF do Titular</label>
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        value={cardCpf}
                        onChange={(e) => setCardCpf(e.target.value)}
                        className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">Parcelamento</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs text-white"
                      >
                        <option value={1}>1x de R$ {total.toFixed(2)} (sem juros)</option>
                        <option value={2}>2x de R$ {(total / 2).toFixed(2)}</option>
                        <option value={3}>3x de R$ {(total / 3).toFixed(2)}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs font-mono text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">Validade (MM/AA)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingCard}
                    className="w-full mt-2 py-3 bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                  >
                    {submittingCard ? 'Processando com Segurança...' : `Pagar R$ ${total.toFixed(2)}`}
                  </button>
                </form>
              )}

              {/* Botão de Verificação Manual e Status */}
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 flex items-center justify-between text-stone-400">
                <span className="text-[11px] flex items-center gap-1.5">
                  <Clock size={13} className="text-[#0EB24A]" />
                  A confirmação é automática após o pagamento.
                </span>
                <button
                  type="button"
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={11} className={isChecking ? 'animate-spin' : ''} />
                  <span>Verificar Status</span>
                </button>
              </div>

            </div>
          )}

          {/* 3. SE O PAGAMENTO FOI RECUSADO (Regra #14: Pagamento Recusado) */}
          {paymentStatus === 'PAYMENT_REJECTED' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400">
                <AlertCircle size={36} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Não foi possível confirmar o pagamento</h3>
                <p className="text-stone-300 text-xs mt-1">
                  O gateway recusou a transação ({statusDetail || 'transação não autorizada'}). Verifique com o emissor do seu cartão ou tente via Pix.
                </p>
              </div>
              <button
                onClick={() => setPaymentStatus('PAYMENT_PENDING')}
                className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Tentar Outra Forma de Pagamento
              </button>
            </div>
          )}

          {/* 4. SE O PAGAMENTO EXPIROU OU FOI CANCELADO */}
          {(paymentStatus === 'PAYMENT_EXPIRED' || paymentStatus === 'PAYMENT_CANCELLED') && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-stone-400">
                <Clock size={36} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Pagamento Expirado</h3>
                <p className="text-stone-300 text-xs mt-1">
                  O prazo de 15 minutos para liquidação do Pix foi atingido. O pedido não foi liquidado.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-xs transition cursor-pointer"
              >
                Gerar Novo Pedido
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <span>Ambiente de Pagamento Certificado MerMi Fit Life</span>
          <button
            onClick={onClose}
            className="hover:text-white transition cursor-pointer underline"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>
  );
};
