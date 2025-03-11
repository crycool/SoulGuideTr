export interface DreamAnalysis {
  id: string;
  content: string;
  timestamp: Date;
  emotions: Array<{
    type: string;
    intensity: number;
    context: string;
  }>;
  symbols: Array<{
    name: string;
    meaning: string;
    frequency?: number;
  }>;
  clarity: number;
  isLucid: boolean;
  tags: string[];
  insights: string[];
  suggestions: string[];
  mainTheme: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  messageType?: string;
  metadata?: {
    emotions?: EmotionDetail[];
    symbols?: SymbolDetail[];
    clarity?: number;
    lucidity?: boolean;
  };
}

export interface EmotionDetail {
  type: string;
  intensity: number;
  context?: string;
}

export interface SymbolDetail {
  name: string;
  meaning: string;
  frequency: number;
  personalContext?: string;
  universalContext?: string;
}

export interface DreamStats {
  totalDreams: number;
  lucidDreams: number;
  avgClarity: number;
  commonEmotions: string[];
  commonSymbols: string[];
  streakDays: number;
}

export interface DreamInsight {
  id: string;
  title: string;
  description: string;
  type: 'pattern' | 'emotion' | 'symbol' | 'suggestion';
  relatedDreams?: string[];
  timestamp: Date;
}

export interface DreamRecord {
  id: string;
  date: Date;
  dreamContent: string;
  aiInterpretation: string;
  sleepQuality: number;
  dreamClarity: number;
  emotions: {
    duringDream: string[];
    afterDream: string;
  };
  elements: {
    characters: string[];
    places: string[];
    symbols: string[];
  };
  themes: string[];
  personalNotes: string;
  tags: string[];
  isRecurring: boolean;
  isLucid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Filtre seçenekleri için tip
export interface DreamFilterOptions {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  emotions?: string[];
  themes?: string[];
  symbol?: string; // Tekil bir sembol arama filtresi ekledik
  tag?: string; // Arketip filtresi için
  searchText?: string;
  isRecurring?: boolean;
  isLucid?: boolean;
  sortBy: 'date' | 'sleepQuality' | 'dreamClarity';
  sortOrder: 'asc' | 'desc';
}

// Navigasyon parametreleri için
export interface DreamArchiveParams {
  screen: string;
  params?: {
    dreamId?: string;
  };
}

// TypeScript'te interface'ler transpile edildiğinde JavaScript'te kaybolur
// Bu yüzden runtime'da kullanılabilecek bir nesne de export ediyoruz
const messageTypes = {
  Message: {},
  EmotionDetail: {},
  SymbolDetail: {},
  DreamStats: {},
  DreamInsight: {}
};

export { messageTypes as default };
