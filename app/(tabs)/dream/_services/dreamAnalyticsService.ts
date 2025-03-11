import { DreamRecord } from '../_utils/messageTypes';
import {
  groupByDate,
  calculateMovingAverage,
  aggregateByPeriod,
  normalizeFrequencies,
  sortByFrequency,
  calculateStatistics
} from '../_utils/analyticsUtils';

// Analiz için tip tanımlamaları
export type EmotionData = { name: string; value: number; color: string };
export type ThemeData = { name: string; value: number; color: string };
export type ArchetypeData = { name: string; value: number; color: string };
export type QualityData = { date: string; clarity: number; sleepQuality: number; clarityMA?: number; sleepQualityMA?: number };
export type FrequencyData = { period: string; count: number; type?: string };
export type SymbolData = { text: string; value: number; color?: string };
export type TimePatternData = {
  dayOfWeek: Record<string, number>,
  timeOfDay: Record<string, number>
};
export type AnalyticsSummary = {
  totalDreams: number;
  avgQuality: number;
  topEmotion: string;
  topTheme: string;
  lastDreamDate: string;
  recordedDays: number;
  dreamTypes: Record<string, number>;
};

/**
* Rüya Analitikleri Servisi
* Rüya verilerini işleyerek anlamlı istatistikler ve grafikler için veri yapıları üretir
*/
export class DreamAnalyticsService {
  /**
   * Tarihi güvenli bir şekilde işler ve bir Date objesi döndürür
   * @param dateInput Tarih girdisi (string, timestamp, Date objesi vb olabilir)
   * @returns Geçerli bir Date objesi veya şu anki zaman
   */
  parseSafeDate(dateInput: any): Date {
    try {
      // Date objesi ise doğrudan döndür
      if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
        return dateInput;
      }
      
      // String ise
      if (typeof dateInput === 'string') {
        // ISO formatında tarih denemesi
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
          return date;
        }
        
        // Timestamp olabilir mi?
        if (/^\d+$/.test(dateInput)) {
          const timestamp = parseInt(dateInput, 10);
          const date = new Date(timestamp);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
      
      // Sayı ise (timestamp)
      if (typeof dateInput === 'number') {
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
      
      // Uygun bir tarih üretilemedi, şu anki zamanı kullan
      console.warn('Geçersiz tarih formatı, şu anki zaman kullanılıyor:', dateInput);
      return new Date();
    } catch (error) {
      console.error('Tarih işleme hatası:', error, dateInput);
      return new Date(); // Hata durumunda şu anki zamanı kullan
    }
  }
/**
* Duygu dağılımını hesaplar
* @param dreams Rüya kayıtları
* @returns Duygu dağılımı verisi
*/
getEmotionsDistribution(dreams: DreamRecord[]): EmotionData[] {
    try {
    // Rüya listesini kontrol et
    if (!dreams || !Array.isArray(dreams) || dreams.length === 0) {
    console.log('Duygu dağılımı için veri yok');
      return [];
      }

      // Duygu sıklıklarını hesapla
      const emotionCounts: Record<string, number> = {};
      
    dreams.forEach(dream => {
    if (dream.emotions && dream.emotions.duringDream && Array.isArray(dream.emotions.duringDream) && dream.emotions.duringDream.length > 0) {
    dream.emotions.duringDream.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      }
      });

      // Renk paleti - Türkçe duygu adlarıyla eşleştirme
      const emotionColors: Record<string, string> = {
      // Olumlu duygular
      'Mutluluk': '#FFD700', // Altın sarısı
      'Sevgi': '#FF1493', // Pembe
      'Huzur': '#98FB98', // Açık yeşil
      'Heyecan': '#FF4500', // Turuncu-kırmızı
    'Tatmin': '#00BFFF', // Açık mavi
    'Umut': '#00CED1', // Türkuaz
    'Güven': '#32CD32', // Lime yeşil
    'Başarı': '#9370DB', // Mor
      'Merak': '#40E0D0', // Türkuaz
      'Nostalji': '#DDA0DD', // Erik moru
      'Neşe': '#F4A460', // Sandy brown
      'Gurur': '#DA70D6', // Orkide
    'İlham': '#87CEFA', // Açık gökyüzü mavisi

// Olumsuz duygular
'Öfke': '#FF0000', // Kırmızı
'Korku': '#800080', // Mor
'Üzüntü': '#4169E1', // Royal mavi
'Suçlu': '#228B22', // Forest yeşil
  'Utanmış': '#DB7093', // Pale violet red
'Endişe': '#BA55D3', // Medium orchid
'Kıskançlık': '#006400', // Koyu yeşil
  'Hayal kırıklığı': '#B22222', // Firebrick
    'Panik': '#B22222', // Firebrick kırmızı
        'Stres': '#8B0000', // Koyu kırmızı
        'Kaygı': '#9932CC', // Koyu orkide moru

        // Nötr duygular
        'Şaşkınlık': '#DEB887', // Burlywood
        'Kafa karışıklığı': '#A9A9A9', // Koyu gri
        'Nötr': '#808080', // Gri
        'Umutsuz': '#696969', // Koyu gri
        'Belirsiz': '#708090',  // Gri-mavi

        // Varsayılan renkler
        'diğer': '#A9A9A9'  // Gri
      };
        
      // EmotionData dizisi oluştur
      return Object.keys(emotionCounts).map(emotion => {
        // Duygu adı için renk bul
        const normalizedEmotion = emotion;
        const color = emotionColors[normalizedEmotion] || '#' + Math.floor(Math.random()*16777215).toString(16);
        
        return {
          name: emotion,
          value: emotionCounts[emotion],
          color: color
        };
      }).sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error('getEmotionsDistribution hatası:', error);
      return [];
    }
  }

  /**
   * Arketip dağılımını hesaplar
   * @param dreams Rüya kayıtları
   * @returns Arketip dağılımı verisi
   */
  getArchetypesDistribution(dreams: DreamRecord[]): ArchetypeData[] {
    try {
      // Rüya listesini kontrol et
      if (!dreams || !Array.isArray(dreams) || dreams.length === 0) {
        console.log('Arketip dağılımı için veri yok');
        return [];
      }
      
      // Arketip sıklıklarını hesapla
      const archetypeCounts: Record<string, number> = {};
      
      dreams.forEach(dream => {
        if (dream.tags && Array.isArray(dream.tags) && dream.tags.length > 0) {
          dream.tags.forEach(tag => {
            if (tag && typeof tag === 'string') {
              archetypeCounts[tag] = (archetypeCounts[tag] || 0) + 1;
            }
          });
        }
      });
      
      // Arketip renkleri
      const archetypeColors = [
        '#8e44ad', '#9b59b6', '#2980b9', '#3498db', '#1abc9c', 
        '#16a085', '#27ae60', '#2ecc71', '#f39c12', '#e67e22',
        '#d35400', '#e74c3c', '#c0392b', '#f1c40f', '#f3a683'
      ];
      
      // ArchetypeData dizisi oluştur
      return Object.keys(archetypeCounts).map((archetype, index) => ({
        name: archetype,
        value: archetypeCounts[archetype],
        color: archetypeColors[index % archetypeColors.length]
      })).sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error('getArchetypesDistribution hatası:', error);
      return [];
    }
  }
  
  /**
   * Tema dağılımını hesaplar
   * @param dreams Rüya kayıtları
   * @returns Tema dağılımı verisi
   */
  getThemesDistribution(dreams: DreamRecord[]): ThemeData[] {
    try {
      // Rüya listesini kontrol et
      if (!dreams || !Array.isArray(dreams) || dreams.length === 0) {
        console.log('Tema dağılımı için veri yok');
        return [];
      }
      
      // Tema sıklıklarını hesapla
      const themeCounts: Record<string, number> = {};
      
      dreams.forEach(dream => {
        if (dream.themes && Array.isArray(dream.themes) && dream.themes.length > 0) {
          dream.themes.forEach(theme => {
            if (theme && typeof theme === 'string') {
              themeCounts[theme] = (themeCounts[theme] || 0) + 1;
            }
          });
        }
      });
      
      // Tema renkleri (temsili)
      const themeColors = [
        '#4285F4', '#EA4335', '#FBBC05', '#34A853', 
        '#FF6D01', '#46BDC6', '#7F5DF0', '#FF66C4',
        '#4B0082', '#00FFFF', '#FF00FF', '#FFFF00'
      ];
      
      // ThemeData dizisi oluştur
      return Object.keys(themeCounts).map((theme, index) => ({
        name: theme,
        value: themeCounts[theme],
        color: themeColors[index % themeColors.length]
      })).sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error('getThemesDistribution hatası:', error);
      return [];
    }
  }
  
  /**
   * Zaman içinde rüya kalitesi değişimini hesaplar
   * @param dreams Rüya kayıtları
   * @returns Rüya kalitesi trend verisi
   */
  getDreamQualityTrend(dreams: DreamRecord[]): QualityData[] {
    try {
      console.log('getDreamQualityTrend çağrıldı, rüya sayısı:', dreams.length);
      
      // Rüyaları tarihe göre sırala
      const sortedDreams = [...dreams].sort((a, b) => {
        try {
          // Tarihleri güvenli bir şekilde işle
          const dateA = this.parseSafeDate(a.date);
          const dateB = this.parseSafeDate(b.date);
          return dateA.getTime() - dateB.getTime();
        } catch (error) {
          console.error('Tarih sıralama hatası:', error);
          return 0; // Hata durumunda sıralamayı değiştirme
        }
      });
      
      // Günlük ortalama kalite değerlerini hesapla
      const dailyData: Record<string, { clarity: number[], sleepQuality: number[] }> = {};
      
      sortedDreams.forEach(dream => {
        try {
          // Date objesini ISO formatında string'e çevir (yyyy-MM-dd)
          const dateObj = this.parseSafeDate(dream.date);
          const dateStr = dateObj.toISOString().split('T')[0]; // Sadece tarih kısmını al
          
          if (!dailyData[dateStr]) {
            dailyData[dateStr] = { clarity: [], sleepQuality: [] };
          }
          
          if (dream.dreamClarity !== undefined) {
            dailyData[dateStr].clarity.push(dream.dreamClarity);
          }
          
          if (dream.sleepQuality !== undefined) {
            dailyData[dateStr].sleepQuality.push(dream.sleepQuality);
          }
        } catch (error) {
          console.error('Günlük veri hazırlama hatası:', error, dream.date);
        }
      });
      
      // Günlük ortalamaları hesapla
      const qualityData: QualityData[] = Object.keys(dailyData).map(date => {
        const dayData = dailyData[date];
        
        const clarityAvg = dayData.clarity.length > 0
          ? dayData.clarity.reduce((sum, val) => sum + val, 0) / dayData.clarity.length
          : 0;
          
        const sleepQualityAvg = dayData.sleepQuality.length > 0
          ? dayData.sleepQuality.reduce((sum, val) => sum + val, 0) / dayData.sleepQuality.length
          : 0;
          
        return {
          date,
          clarity: clarityAvg,
          sleepQuality: sleepQualityAvg
        };
      }).sort((a, b) => {
        try {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } catch (error) {
          console.error('QualityData sıralama hatası:', error);
          return 0;
        }
      });
      
      // Hareketli ortalama hesapla (en az 7 gün veri varsa)
      if (qualityData.length >= 7) {
        const clarityValues = qualityData.map(d => d.clarity);
        const sleepQualityValues = qualityData.map(d => d.sleepQuality);
        
        const clarityMA = calculateMovingAverage(clarityValues, 7);
        const sleepQualityMA = calculateMovingAverage(sleepQualityValues, 7);
        
        // Hareketli ortalamaları ekle
        qualityData.forEach((data, index) => {
          data.clarityMA = clarityMA[index];
          data.sleepQualityMA = sleepQualityMA[index];
        });
      }
      
      console.log('QualityData hazırlandı, adet:', qualityData.length);
      return qualityData;
    } catch (error) {
      console.error('getDreamQualityTrend hatası:', error);
      return []; // Hata durumunda boş dizi döndür
    }
  }
  
  /**
   * Belirli bir zaman aralığında rüya sıklığını hesaplar
   * @param dreams Rüya kayıtları
   * @param period Periyot ('week' veya 'month')
   * @returns Rüya sıklığı verisi
   */
  getDreamFrequency(dreams: DreamRecord[], period: 'week' | 'month' = 'week'): FrequencyData[] {
    // Rüyaları tarihe göre grupla
    const groupedByDate = groupByDate(dreams);
    
    // Periyoda göre topla
    const aggregated = aggregateByPeriod(groupedByDate, period);
    
    // FrequencyData dizisi oluştur
    return Object.keys(aggregated)
      .sort() // Kronolojik sıra
      .map(periodKey => {
        // Rüya tiplerini say
        const dreamTypes: Record<string, number> = {};
        aggregated[periodKey].forEach(dream => {
          const type = dream.type || 'normal';
          dreamTypes[type] = (dreamTypes[type] || 0) + 1;
        });
        
        // Her tip için veri noktası oluştur
        const result: FrequencyData[] = [];
        
        Object.keys(dreamTypes).forEach(type => {
          result.push({
            period: periodKey,
            count: dreamTypes[type],
            type
          });
        });
        
        // Tip belirtilmemiş toplam da ekle
        result.push({
          period: periodKey,
          count: aggregated[periodKey].length
        });
        
        return result;
      })
      .flat();
  }
  
  /**
   * Rüya sembollerini analiz eder ve görülme sıklığını hesaplar
   * @param dreams Rüya kayıtları
   * @returns Sembol sıklığı verisi
   */
  getSymbolsFrequency(dreams: DreamRecord[]): Record<string, number> {
    const symbolCounts: Record<string, number> = {};
    
    dreams.forEach(dream => {
      // elements.symbols'dan sembolleri al
      if (dream.elements && dream.elements.symbols && dream.elements.symbols.length > 0) {
        dream.elements.symbols.forEach(symbol => {
          symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });
      }
      
      // Eski sembol formatını da kontrol et (geriye dönük uyumluluk için)
      if (dream.symbols && dream.symbols.length > 0) {
        dream.symbols.forEach(symbol => {
          symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });
      }
    });
    
    return symbolCounts;
  }
  
  /**
   * En sık görülen sembolleri listeler
   * @param dreams Rüya kayıtları
   * @param limit Sınır (kaç sembol)
   * @returns En sık görülen semboller
   */
  getTopSymbols(dreams: DreamRecord[], limit: number = 50): SymbolData[] {
    const symbolFrequencies = this.getSymbolsFrequency(dreams);
    
    // Renk paleti (temsili)
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];
    
    // Sıklığa göre sırala ve limit uygula
    return Object.keys(symbolFrequencies)
      .map((symbol, index) => ({
        text: symbol,
        value: symbolFrequencies[symbol],
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }
  
  /**
   * Rüyaların görüldüğü gün ve zaman örüntülerini analiz eder
   * @param dreams Rüya kayıtları
   * @returns Zaman örüntüsü analizi
   */
  getTimePatterns(dreams: DreamRecord[]): TimePatternData {
    // Günlerin Türkçe isimleri
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    
    // Zaman dilimleri
    const timeSlots = {
      'Sabah (05:00-08:59)': { start: 5, end: 8 },
      'Öğle (09:00-12:59)': { start: 9, end: 12 },
      'İkindi (13:00-16:59)': { start: 13, end: 16 },
      'Akşam (17:00-20:59)': { start: 17, end: 20 },
      'Gece (21:00-00:59)': { start: 21, end: 24 },
      'Gece Yarısı (01:00-04:59)': { start: 1, end: 4 }
    };
    
    // Gün ve zaman sayımları için nesneler oluştur
    const dayOfWeek: Record<string, number> = {};
    dayNames.forEach(day => dayOfWeek[day] = 0);
    
    const timeOfDay: Record<string, number> = {};
    Object.keys(timeSlots).forEach(slot => timeOfDay[slot] = 0);
    
    // Rüyaları döngüyle işle
    dreams.forEach(dream => {
      const dreamDate = new Date(dream.date);
      const day = dayNames[dreamDate.getDay()];
      const hour = dreamDate.getHours();
      
      // Güne göre say
      dayOfWeek[day] += 1;
      
      // Saate göre say
      let timeSlot = 'Belirsiz';
      for (const [slotName, slotRange] of Object.entries(timeSlots)) {
        if ((hour >= slotRange.start && hour <= slotRange.end) || 
            (slotRange.start > slotRange.end && (hour >= slotRange.start || hour <= slotRange.end))) {
          timeSlot = slotName;
          break;
        }
      }
      
      if (timeSlot !== 'Belirsiz') {
        timeOfDay[timeSlot] = (timeOfDay[timeSlot] || 0) + 1;
      }
    });
    
    return { dayOfWeek, timeOfDay };
  }
  
  /**
   * Özet istatistikleri hesaplar
   * @param dreams Rüya kayıtları
   * @returns Özet istatistikler
   */
  getAnalyticsSummary(dreams: DreamRecord[]): AnalyticsSummary {
    // Eğer hiç rüya yoksa varsayılan değerler
    if (dreams.length === 0) {
      return {
        totalDreams: 0,
        avgQuality: 0,
        topEmotion: '-',
        topTheme: '-',
        lastDreamDate: '-',
        recordedDays: 0,
        dreamTypes: {}
      };
    }
    
    // Toplam rüya sayısı
    const totalDreams = dreams.length;
    
    // Ortalama rüya kalitesi (dreamClarity)
    const clarityValues = dreams
      .filter(dream => dream.dreamClarity !== undefined)
      .map(dream => dream.dreamClarity!);
    
    const avgQuality = clarityValues.length > 0
      ? clarityValues.reduce((sum, val) => sum + val, 0) / clarityValues.length
      : 0;
    
    // En sık görülen duygu
    const emotions = this.getEmotionsDistribution(dreams);
    const topEmotion = emotions.length > 0 ? emotions[0].name : '-';
    
    // En sık görülen tema
    const themes = this.getThemesDistribution(dreams);
    const topTheme = themes.length > 0 ? themes[0].name : '-';
    
    // Son rüya tarihi
    const dates = dreams.map(dream => new Date(dream.date).getTime());
    const lastDreamDate = dates.length > 0
      ? new Date(Math.max(...dates)).toISOString().split('T')[0]
      : '-';
    
    // Kayıt edilmiş gün sayısı
    const uniqueDates = new Set(dreams.map(dream => dream.date));
    const recordedDays = uniqueDates.size;
    
    // Rüya tipleri
    const dreamTypes: Record<string, number> = {};
    dreams.forEach(dream => {
      const type = dream.type || 'normal';
      dreamTypes[type] = (dreamTypes[type] || 0) + 1;
    });
    
    return {
      totalDreams,
      avgQuality,
      topEmotion,
      topTheme,
      lastDreamDate,
      recordedDays,
      dreamTypes
    };
  }
}

// Servis singleton
export const dreamAnalyticsService = new DreamAnalyticsService();

// Default export for Expo Router compatibility
export default dreamAnalyticsService;