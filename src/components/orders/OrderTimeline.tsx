import React from 'react';
import { OrderTimelineEvent, OrderStatus } from '../../types/food';
import { Check, Clock, PackageCheck, Flame, ChefHat, Truck, CheckCircle2 } from 'lucide-react';

interface OrderTimelineProps {
  timeline: OrderTimelineEvent[];
  currentStatus: OrderStatus;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ timeline, currentStatus }) => {
  const getStepIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pedido_recebido':
        return Clock;
      case 'pagamento_confirmado':
        return CheckCircle2;
      case 'em_preparacao':
        return ChefHat;
      case 'em_producao':
        return Flame;
      case 'embalado':
        return PackageCheck;
      case 'saiu_para_entrega':
        return Truck;
      case 'entregue':
        return Check;
      default:
        return Clock;
    }
  };

  return (
    <div className="py-2">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {timeline.map((event, index) => {
          const Icon = getStepIcon(event.status);
          const isCurrent = event.status === currentStatus;
          const isDone = event.completed;

          return (
            <div key={index} className="relative flex items-start gap-3">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  isCurrent
                    ? 'bg-[#0EB24A] text-white ring-4 ring-emerald-100 shadow-sm animate-pulse'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-400 border border-stone-300'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-2.5 h-2.5" />}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5
                    className={`font-black text-xs font-['Outfit'] ${
                      isCurrent
                        ? 'text-[#0EB24A]'
                        : isDone
                        ? 'text-stone-900'
                        : 'text-stone-400'
                    }`}
                  >
                    {event.label}
                  </h5>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
