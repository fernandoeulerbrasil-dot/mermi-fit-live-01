import React from 'react';
import {
  Sparkles,
  Award,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Gift,
  Heart,
  MessageCircle,
  Share2,
  Bell,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { MetricNumber } from './Typography';
import { PrimaryButton, PointsButton, OutlineButton } from './Button';

// 1. CARDBASE: Base versátil e elegante
export interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  environment?: 'claro' | 'escuro';
  elevation?: 'flat' | 'subtle' | 'elevated' | 'glow';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CardBase: React.FC<CardBaseProps> = ({
  environment = 'claro',
  elevation = 'subtle',
  children,
  className = '',
  onClick,
  ...props
}) => {
  const isDark = environment === 'escuro';

  const elevationClasses = {
    flat: 'border border-stone-200 dark:border-stone-800 shadow-none',
    subtle: isDark
      ? 'border border-stone-800 shadow-lg shadow-black/40'
      : 'border border-stone-200/90 shadow-sm shadow-stone-200/50',
    elevated: isDark
      ? 'border border-stone-700/80 shadow-2xl shadow-black/80'
      : 'border border-stone-200 shadow-md shadow-stone-300/40',
    glow: isDark
      ? 'border-2 border-amber-500/40 shadow-xl shadow-amber-500/10'
      : 'border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
  }[elevation];

  const bgClasses = isDark
    ? 'bg-[#171920] text-white'
    : 'bg-white text-stone-900';

  const interactiveClasses = onClick
    ? 'cursor-pointer transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-4 sm:p-5 relative overflow-hidden ${bgClasses} ${elevationClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 2. CARDPRODUCT: Card de Marmita (Fit / Fit Premium) com tamanho, preço e botão personalizar
export interface CardProductProps {
  id: string;
  name: string;
  category: 'fit' | 'fit_premium';
  size: '350g' | '500g';
  price: number;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  pointsEarned: number;
  imageUrl?: string;
  tags?: string[];
  isAvailable?: boolean;
  onCustomize: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

export const CardProduct: React.FC<CardProductProps> = ({
  id,
  name,
  category,
  size,
  price,
  description,
  calories,
  protein,
  carbs,
  pointsEarned,
  imageUrl,
  tags = [],
  isAvailable = true,
  onCustomize,
  onAddToCart
}) => {
  const isPremium = category === 'fit_premium';

  return (
    <CardBase environment="claro" elevation="subtle" className="flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-['Outfit'] ${
                isPremium
                  ? 'bg-amber-400 text-stone-950 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isPremium ? 'Fit Premium' : 'Linha Fit'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
              {size}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-black border border-amber-500/20">
            <Award className="w-3 h-3 text-amber-600" />
            <span>+{pointsEarned} pts</span>
          </div>
        </div>

        {/* Product Visual & Header */}
        <div className="flex gap-3 items-start my-2">
          {imageUrl && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-stone-100 shadow-inner bg-stone-50">
              <img
                src={imageUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-black text-base sm:text-lg text-stone-900 leading-tight uppercase font-['Outfit']">
              {name}
            </h3>
            <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Nutritional Pills */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-stone-600 my-2.5 bg-[#FBF7EE] p-2 rounded-xl border border-stone-200/60">
          <span>{calories} kcal</span>
          <span className="text-stone-300">·</span>
          <span>{protein}g prot</span>
          <span className="text-stone-300">·</span>
          <span>{carbs}g carb</span>
        </div>
      </div>

      {/* Pricing & Action */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 mt-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 block leading-none">Preço Base</span>
          <MetricNumber
            value={price.toFixed(2).replace('.', ',')}
            prefix="R$"
            highlightColor="text-[#0EB24A]"
            size="md"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <PrimaryButton
            size="sm"
            onClick={() => onCustomize(id)}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Personalizar
          </PrimaryButton>
        </div>
      </div>
    </CardBase>
  );
};

// 3. CARDPOINTS: Card de gamificação / saldo de Points com ambiente escuro
export interface CardPointsProps {
  points: number;
  level: number;
  nextLevelPoints: number;
  streakDays?: number;
  onViewRewards: () => void;
}

export const CardPoints: React.FC<CardPointsProps> = ({
  points,
  level,
  nextLevelPoints,
  streakDays = 5,
  onViewRewards
}) => {
  const progressPercent = Math.min(100, Math.round((points % 250) / 2.5));

  return (
    <CardBase environment="escuro" elevation="glow" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
              MerMi Points · Nível {level}
            </span>
            <span className="text-xs text-stone-300 font-medium">
              Evolução e Recompensas Reais
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-stone-900/90 border border-stone-800 px-2.5 py-1 rounded-full text-xs font-bold text-orange-400">
          <Flame className="w-3.5 h-3.5 fill-orange-400" />
          <span>{streakDays} dias seguidos</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <MetricNumber
          value={points.toLocaleString('pt-BR')}
          unit="Points"
          highlightColor="text-white"
          size="lg"
        />
        <PointsButton size="sm" onClick={onViewRewards}>
          Ver Recompensas
        </PointsButton>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[10px] text-stone-400 mb-1 font-bold">
          <span>Progresso para Nível {level + 1}</span>
          <span>{points % 250} / 250 pts</span>
        </div>
        <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </CardBase>
  );
};

// 4. CARDCHALLENGE: Card de Desafio
export interface CardChallengeProps {
  id: string;
  title: string;
  category: string;
  rewardPoints: number;
  deadline: string;
  progressText: string;
  progressPercent: number;
  onParticipate?: () => void;
}

export const CardChallenge: React.FC<CardChallengeProps> = ({
  title,
  category,
  rewardPoints,
  deadline,
  progressText,
  progressPercent,
  onParticipate
}) => {
  return (
    <CardBase environment="claro" elevation="subtle" className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
          {category}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Award className="w-3 h-3" />
          +{rewardPoints} pts
        </span>
      </div>

      <h4 className="font-black text-base text-stone-900 leading-tight font-['Outfit'] uppercase">
        {title}
      </h4>

      <div>
        <div className="flex justify-between text-xs text-stone-500 font-semibold mb-1">
          <span>{progressText}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-[#0EB24A] rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <span className="text-[10px] text-stone-400 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {deadline}
        </span>
        <button
          onClick={onParticipate}
          className="text-xs font-black text-[#0EB24A] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Participar</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </CardBase>
  );
};

// 5. CARDACHIEVEMENT: Card de Conquista desbloqueada
export const CardAchievement: React.FC<{
  title: string;
  description: string;
  points: number;
  unlockedAt: string;
}> = ({ title, description, points, unlockedAt }) => {
  return (
    <CardBase environment="escuro" elevation="subtle" className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-sm text-white font-['Outfit'] uppercase truncate">
          {title}
        </h4>
        <p className="text-xs text-stone-400 leading-tight mt-0.5">{description}</p>
        <span className="text-[10px] text-stone-500 mt-1 block">Conquistado em {unlockedAt}</span>
      </div>
      <div className="text-right shrink-0">
        <span className="text-xs font-black text-amber-400 font-['Outfit']">+{points} pts</span>
      </div>
    </CardBase>
  );
};

// 6. CARDPROGRESS: Card de métrica diária (Água, Passos, Sono)
export const CardProgress: React.FC<{
  icon: React.ReactNode;
  label: string;
  currentValue: string;
  goalValue: string;
  progressPercent: number;
  color?: string;
}> = ({ icon, label, currentValue, goalValue, progressPercent, color = 'bg-[#0EB24A]' }) => {
  return (
    <CardBase environment="claro" elevation="subtle" className="p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            {icon}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">{label}</span>
            <span className="text-sm font-black text-stone-900 font-['Outfit']">{currentValue}</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-stone-400">Meta: {goalValue}</span>
      </div>
      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, progressPercent)}%` }} />
      </div>
    </CardBase>
  );
};

// 7. CARDPOST: Card de post da comunidade
export const CardPost: React.FC<{
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  pointsBadge?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}> = ({
  authorName,
  authorHandle,
  authorAvatar,
  timestamp,
  content,
  imageUrl,
  likesCount,
  commentsCount,
  pointsBadge,
  onLike,
  onComment,
  onShare
}) => {
  const [liked, setLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(likesCount);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    if (onLike) onLike();
  };

  return (
    <CardBase environment="claro" elevation="subtle" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={authorAvatar}
            alt={authorName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-stone-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-stone-900 font-['Outfit']">{authorName}</span>
              <span className="text-[10px] text-stone-400">{authorHandle}</span>
            </div>
            <span className="text-[10px] text-stone-400">{timestamp}</span>
          </div>
        </div>

        {pointsBadge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
            {pointsBadge}
          </span>
        )}
      </div>

      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{content}</p>

      {imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-stone-100 max-h-72">
          <img src={imageUrl} alt="Post media" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-stone-500 text-xs">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 cursor-pointer transition-colors ${
            liked ? 'text-rose-500 font-bold' : 'hover:text-stone-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
          <span>{likes}</span>
        </button>

        <button onClick={onComment} className="flex items-center gap-1 hover:text-stone-700 cursor-pointer">
          <MessageCircle className="w-4 h-4" />
          <span>{commentsCount}</span>
        </button>

        <button onClick={onShare} className="flex items-center gap-1 hover:text-stone-700 cursor-pointer">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </CardBase>
  );
};

// 8. CARDCAMPAIGN: Card de campanha / banner especial
export const CardCampaign: React.FC<{
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText: string;
  imageUrl?: string;
  onCta: () => void;
}> = ({ title, subtitle, badgeText = 'Campanha Especial', ctaText, imageUrl, onCta }) => {
  return (
    <div
      onClick={onCta}
      className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-stone-950 via-[#1c080a] to-[#250d0a] text-white border-2 border-rose-600/30 shadow-xl cursor-pointer relative overflow-hidden group"
    >
      <div className="relative z-10 max-w-sm space-y-2">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
          {badgeText}
        </span>
        <h3 className="text-xl sm:text-2xl font-black uppercase font-['Outfit'] tracking-tight text-white leading-tight">
          {title}
        </h3>
        <p className="text-xs text-stone-300 leading-relaxed">{subtitle}</p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0EB24A] to-emerald-500 text-white font-black text-xs uppercase tracking-wide group-hover:scale-105 transition-transform">
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

// 9. CARDREWARD: Card de resgate com custo em Points
export const CardReward: React.FC<{
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  stock: number;
  canAfford: boolean;
  onRedeem: (id: string) => void;
}> = ({ id, title, pointsCost, description, stock, canAfford, onRedeem }) => {
  return (
    <CardBase environment="escuro" elevation="subtle" className="flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {pointsCost} Points
          </span>
          <span className={`text-[10px] font-bold ${stock > 0 ? 'text-stone-400' : 'text-rose-400'}`}>
            {stock > 0 ? `${stock} em estoque` : 'Esgotado'}
          </span>
        </div>

        <h4 className="font-black text-sm text-white font-['Outfit'] uppercase mt-2">{title}</h4>
        <p className="text-xs text-stone-400 mt-1 line-clamp-2">{description}</p>
      </div>

      <button
        disabled={!canAfford || stock <= 0}
        onClick={() => onRedeem(id)}
        className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
      >
        {!canAfford ? 'Saldo Insuficiente' : stock <= 0 ? 'Esgotado' : 'Resgatar Agora'}
      </button>
    </CardBase>
  );
};

// 10. CARDRACE: Card de Corrida de Rua & Eventos
export const CardRace: React.FC<{
  name: string;
  date: string;
  location: string;
  distance: string;
  pointsReward: number;
  status: string;
  onEnroll?: () => void;
}> = ({ name, date, location, distance, pointsReward, status, onEnroll }) => {
  return (
    <CardBase environment="claro" elevation="subtle" className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
          {distance}
        </span>
        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          +{pointsReward} pts
        </span>
      </div>

      <div>
        <h4 className="font-black text-base text-stone-900 font-['Outfit'] uppercase">{name}</h4>
        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs font-bold text-stone-600">{status}</span>
        <PrimaryButton size="sm" onClick={onEnroll}>Inscrever-se</PrimaryButton>
      </div>
    </CardBase>
  );
};

// 11. CARDCOMMUNITY: Card de Destaque da Comunidade
export const CardCommunity: React.FC<{
  title: string;
  subtitle: string;
  membersCount: number;
  highlightText: string;
  onJoin: () => void;
}> = ({ title, subtitle, membersCount, highlightText, onJoin }) => {
  return (
    <CardBase environment="claro" elevation="subtle" className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Comunidade Mermi</span>
        <span className="text-xs font-black text-[#0EB24A]">{membersCount.toLocaleString('pt-BR')} membros</span>
      </div>
      <div>
        <h4 className="font-black text-base text-stone-900 font-['Outfit'] uppercase">{title}</h4>
        <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
      </div>
      <p className="text-xs font-semibold text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
        🔥 {highlightText}
      </p>
      <OutlineButton size="sm" fullWidth onClick={onJoin}>Participar do Grupo</OutlineButton>
    </CardBase>
  );
};

// 12. CARDCONTENT: Card de Conteúdo / Blog / Dica de Saúde
export const CardContent: React.FC<{
  title: string;
  category: string;
  readTime: string;
  snippet: string;
  imageUrl?: string;
  onClick: () => void;
}> = ({ title, category, readTime, snippet, imageUrl, onClick }) => {
  return (
    <CardBase environment="claro" elevation="subtle" onClick={onClick} className="flex gap-3 items-center">
      {imageUrl && (
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-stone-100">
          <img src={imageUrl} alt={title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase">
          <span className="text-[#0EB24A]">{category}</span>
          <span>·</span>
          <span>{readTime}</span>
        </div>
        <h4 className="font-black text-sm text-stone-900 font-['Outfit'] uppercase leading-tight mt-0.5 truncate">
          {title}
        </h4>
        <p className="text-xs text-stone-500 line-clamp-1 mt-1">{snippet}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
    </CardBase>
  );
};

// 13. CARDNOTIFICATION: Card de Notificação
export const CardNotification: React.FC<{
  title: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
  type?: 'points' | 'order' | 'challenge' | 'system';
  onAction?: () => void;
}> = ({ title, message, timestamp, isRead = false, type = 'system', onAction }) => {
  return (
    <div
      onClick={onAction}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
        isRead
          ? 'bg-stone-50/80 border-stone-200/80 text-stone-700'
          : 'bg-white border-emerald-500/40 shadow-sm text-stone-900'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          type === 'points'
            ? 'bg-amber-100 text-amber-700'
            : type === 'order'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-stone-200 text-stone-700'
        }`}
      >
        <Bell className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h5 className="font-black text-xs font-['Outfit'] uppercase">{title}</h5>
          <span className="text-[10px] text-stone-400">{timestamp}</span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{message}</p>
      </div>
      {!isRead && <span className="w-2 h-2 rounded-full bg-[#0EB24A] shrink-0 mt-1" />}
    </div>
  );
};
