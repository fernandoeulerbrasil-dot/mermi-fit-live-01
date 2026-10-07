// MERMI FIT LIFE — BLOCO 16: QA, TESTES, MATRIZ DE FUNCIONALIDADES E GO-LIVE
// Tipos e Interfaces Oficiais de Homologação e Qualidade de Software

export type QaFeatureStatus = 
  | 'PLANEJADO'
  | 'EM_DESENVOLVIMENTO'
  | 'EM_TESTE'
  | 'APROVADO'
  | 'BLOQUEADO'
  | 'PUBLICADO';

export type QaModule =
  | 'AUTENTICACAO'
  | 'PERFIL'
  | 'CARDAPIO'
  | 'PERSONALIZACAO'
  | 'CARRINHO'
  | 'CHECKOUT'
  | 'PAGAMENTO'
  | 'IDEMPOTENCIA'
  | 'MERMI_POINTS'
  | 'MERMI_RUN'
  | 'DESAFIOS_GAMIFICACAO'
  | 'COMUNIDADE'
  | 'NOTIFICACOES'
  | 'PERFORMANCE'
  | 'SEGURANCA_LGPD'
  | 'AUDITORIA_INTEGRIDADE'
  | 'GO_LIVE_PRODUCAO';

export type QaTestCategory =
  | 'FUNCIONALIDADE'
  | 'DADOS'
  | 'REGRAS'
  | 'SEGURANCA'
  | 'PERMISSOES'
  | 'INTEGRACOES'
  | 'PERFORMANCE'
  | 'RESPONSIVIDADE'
  | 'ASSETS'
  | 'NOTIFICACOES'
  | 'PAGAMENTOS'
  | 'AUDITORIA';

export interface QaFeatureMatrixItem {
  id: string;
  module: QaModule;
  featureName: string;
  description: string;
  status: QaFeatureStatus;
  dependencies: string[];
  testsExecuted: number;
  testsPassed: number;
  testsFailed: number;
  lastValidatedAt: string;
  responsible: string;
  notes?: string;
  knownIssues?: string[];
}

export type QaScenarioStatus = 'PASSED' | 'FAILED' | 'PENDING' | 'RUNNING' | 'SKIPPED';

export interface QaTestScenario {
  id: string;
  category: QaTestCategory;
  title: string;
  module: QaModule;
  description: string;
  status: QaScenarioStatus;
  executedAt?: string;
  durationMs?: number;
  inputData?: Record<string, any>;
  expectedOutput?: string;
  actualOutput?: string;
  errorMessage?: string;
}

export interface QaExecutionSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  healthScore: number; // 0 to 100
  executionDate: string;
  testedBy: string;
  environment: 'SANDBOX' | 'HOMOLOGACAO' | 'PRODUCAO';
}

export interface PerformanceBenchmarkResult {
  id: string;
  metricName: string;
  description: string;
  measuredValue: number;
  unit: string;
  threshold: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'FAIL';
}

export interface GoLiveChecklistItem {
  id: string;
  category: 'SEGURANCA' | 'PERFORMANCE' | 'RESPONSIVIDADE' | 'ASSETS' | 'PWA_OFFLINE' | 'PAGAMENTOS' | 'LEGAL_LGPD' | 'DADOS_BACKUP';
  title: string;
  description: string;
  isVerified: boolean;
  priority: 'CRITICA' | 'ALTA' | 'MEDIA';
  verifiedBy?: string;
  verifiedAt?: string;
}
