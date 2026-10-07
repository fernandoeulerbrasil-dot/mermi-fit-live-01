/**
 * MERMI FIT LIFE — DESIGN SYSTEM CENTRAL (BLOCO 02)
 * Tokens de cores, tipografia, espaçamentos, bordas, sombras e transições.
 */

export const DESIGN_TOKENS = {
  // Paletas dos dois ambientes visuais principais
  environments: {
    // AMBIENTE A: MERMI FIT LIFE (Lifestyle, leveza, saúde, nutrição, evolução)
    ambienteA: {
      id: 'mermi-fit-life',
      name: 'MERMI FIT LIFE (Lifestyle)',
      bg: '#FBF7EE',           // Creme / Bege oficial de fundo
      bgSurface: '#FFFFFF',    // Branco puro para cards e superfícies
      bgSubtle: '#F4EFE2',     // Bege sutil para divisórias e fundos secundários
      textPrimary: '#1C1917',  // Pedra 900 para contraste e leitura
      textSecondary: '#57534E',// Pedra 600 para textos secundários
      textMuted: '#78716C',    // Pedra 500 para legendas e labels
      border: '#E7E5E4',       // Borda suave
      borderActive: '#0EB24A', // Borda ativa verde
      
      // Cores de Ação e Identidade
      primaryGreen: '#0EB24A', // Verde Mermi (saúde, ação, evolução, confirmação)
      primaryGreenHover: '#0CA042',
      energyRed: '#E52525',    // Vermelho (energia, alertas, campanhas especiais)
      energyRedHover: '#CC1F1F',
      foodOrange: '#F97316',   // Laranja (alimentação, energia, combos)
      goldYellow: '#FBBF24',   // Dourado / Amarelo (conquistas, troféus)
    },

    // AMBIENTE B: MERMI POINTS (Gamificação, alto contraste, premium, ranking)
    ambienteB: {
      id: 'mermi-points',
      name: 'MERMI POINTS (Gamification)',
      bg: '#0F1115',           // Preto / Escuro profundo
      bgSurface: '#171920',    // Superfície escura de cards
      bgSubtle: '#20232B',     // Superfície elevada
      textPrimary: '#FFFFFF',  // Branco puro para alto contraste
      textSecondary: '#A1A1AA',// Zinco 400
      textMuted: '#71717A',    // Zinco 500
      border: '#27272A',       // Borda grafite
      borderActive: '#F59E0B', // Borda ativa dourada
      
      // Cores de Ação e Identidade em Alto Contraste
      primaryGold: '#F59E0B',  // Âmbar / Dourado Points
      primaryGoldHover: '#D97706',
      accentOrange: '#EA580C', // Laranja queima
      neonGreen: '#10B981',    // Verde esmeralda (sucesso / streaks)
      laserRed: '#EF4444',     // Vermelho neon (desafios / destaque)
    }
  },

  // Tipografia Hierárquica (Níveis 1 a 6 + Números)
  typography: {
    fontDisplay: "Outfit, system-ui, -apple-system, sans-serif",
    fontBody: "Inter, system-ui, -apple-system, sans-serif",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",

    levels: {
      level1: {
        fontSize: 'text-2xl sm:text-3xl lg:text-4xl',
        fontWeight: 'font-black',
        letterSpacing: 'tracking-tight',
        textTransform: 'uppercase',
        fontFamily: "font-['Outfit']",
        description: 'Títulos principais de tela'
      },
      level2: {
        fontSize: 'text-xl sm:text-2xl',
        fontWeight: 'font-extrabold',
        letterSpacing: 'tracking-tight',
        textTransform: 'uppercase',
        fontFamily: "font-['Outfit']",
        description: 'Títulos de seções principais'
      },
      level3: {
        fontSize: 'text-base sm:text-lg',
        fontWeight: 'font-bold',
        letterSpacing: 'tracking-normal',
        description: 'Subtítulos e títulos de cards'
      },
      level4: {
        fontSize: 'text-sm sm:text-base',
        fontWeight: 'font-normal',
        lineHeight: 'leading-relaxed',
        description: 'Texto de leitura principal'
      },
      level5: {
        fontSize: 'text-xs sm:text-sm',
        fontWeight: 'font-medium',
        lineHeight: 'leading-normal',
        description: 'Texto auxiliar e legendas'
      },
      level6: {
        fontSize: 'text-[10px] sm:text-xs',
        fontWeight: 'font-bold',
        letterSpacing: 'tracking-wider',
        textTransform: 'uppercase',
        description: 'Labels, chips, metadados'
      },
      metric: {
        fontSize: 'text-2xl sm:text-3xl font-black font-[\'Outfit\']',
        description: 'Números de alto destaque (Points, preços, contadores)'
      }
    }
  },

  // Raios de Borda
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    pill: 'rounded-full'
  },

  // Sombras discretas (sem exageros conforme item 6 do Bloco 02)
  shadows: {
    subtle: 'shadow-sm',
    card: 'shadow-md shadow-stone-200/50 dark:shadow-none',
    elevated: 'shadow-lg shadow-stone-300/40 dark:shadow-black/60',
    highlight: 'shadow-xl shadow-emerald-500/10 dark:shadow-amber-500/10'
  },

  // Transições e Microinterações
  transitions: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-in-out',
    bounce: 'transition-transform duration-200 active:scale-95'
  }
} as const;
