import { DreamRecord } from '../_utils/messageTypes';
import { format, subDays } from 'date-fns';

/**
 * Tarihi güvenli şekilde işler ve geçerli bir Date objesi döndürür
 */
const parseDateSafely = (dateInput: any): Date => {
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
      if (/^\\d+$/.test(dateInput)) {
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
};

/**
 * Rüyaları tarihlerine göre gruplar
 * @param dreams Rüya kayıtları
 * @param dateFormat Tarih formatı (ör: 'yyyy-MM-dd')
 * @returns Tarihe göre gruplanmış rüyalar
 */
export const groupByDate = (dreams: DreamRecord[], dateFormat: string = 'yyyy-MM-dd') => {
  const grouped: Record<string, DreamRecord[]> = {};
  
  dreams.forEach(dream => {
    const date = parseDateSafely(dream.date);
    const formattedDate = format(date, dateFormat);
    
    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }
    
    grouped[formattedDate].push(dream);
  });
  
  return grouped;
};

/**
 * Hareketli ortalama hesaplar
 * @param data Veri noktaları
 * @param window Pencere boyutu
 * @returns Hareketli ortalama dizisi
 */
export const calculateMovingAverage = (data: number[], window: number = 7) => {
  if (data.length < window) {
    return data;
  }
  
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i]);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < window; j++) {
      sum += data[i - j];
    }
    
    result.push(sum / window);
  }
  
  return result;
};

/**
 * Verileri belirli periyotlara göre toplar
 * @param data Veri dizisi
 * @param period Periyot (haftalık, aylık vs.)
 * @returns Periyoda göre toplanmış veriler
 */
export const aggregateByPeriod = (data: Record<string, any[]>, period: 'week' | 'month') => {
  const aggregated: Record<string, any[]> = {};
  
  Object.keys(data).forEach(dateStr => {
    const date = parseDateSafely(dateStr);
    let periodKey: string;
    
    if (period === 'week') {
      // ISO haftası ve yılına göre format: 2023-W01
      const weekNum = Math.ceil((date.getDate() + (date.getDay() === 0 ? 6 : date.getDay() - 1)) / 7);
      periodKey = `${format(date, 'yyyy')}-W${String(weekNum).padStart(2, '0')}`;
    } else {
      // Ay ve yıla göre format: 2023-01
      periodKey = format(date, 'yyyy-MM');
    }
    
    if (!aggregated[periodKey]) {
      aggregated[periodKey] = [];
    }
    
    aggregated[periodKey] = [...aggregated[periodKey], ...data[dateStr]];
  });
  
  return aggregated;
};

/**
 * Sıklık değerlerini normalleştirir
 * @param frequencies Sıklık değerleri
 * @returns Normalleştirilmiş değerler
 */
export const normalizeFrequencies = (frequencies: Record<string, number>) => {
  const values = Object.values(frequencies);
  const maxValue = Math.max(...values);
  
  const normalized: Record<string, number> = {};
  
  Object.keys(frequencies).forEach(key => {
    normalized[key] = frequencies[key] / maxValue;
  });
  
  return normalized;
};

/**
 * Öğeleri sıklıklarına göre sıralar
 * @param items Nesne dizisi
 * @param key Sıralamada kullanılacak değer anahtarı
 * @returns Sıralanmış dizi
 */
export const sortByFrequency = <T extends Record<string, any>>(items: T[], key: string) => {
  return [...items].sort((a, b) => b[key] - a[key]);
};

/**
 * Belirli bir zaman aralığına göre rüyaları filtreler
 * @param dreams Rüya kayıtları
 * @param days Gün sayısı (son X gün)
 * @returns Filtrelenmiş rüya kayıtları
 */
export const filterDreamsByTimeRange = (dreams: DreamRecord[], days: number | null = null) => {
  console.log('filterDreamsByTimeRange çağrıldı:', { dreamsLength: dreams.length, days });
  
  // Eğer days null ise (tüm zamanlar seçili ise), tüm rüyaları döndür
  if (!days) {
    console.log('Tüm zamanlar seçili, filtreleme yapılmayacak');
    return [...dreams]; // Kopya dizisi döndür
  }
  
  try {
    const today = new Date();
    const startDate = subDays(today, days);
    
    console.log('Filtreleme tarihleri:', { 
      today: today.toISOString(), 
      startDate: startDate.toISOString(),
      days
    });
    
    // Kontrol amaçlı ilk 3 rüyanın tarihlerini log'la
    if (dreams.length > 0) {
      console.log('Filtrelenmeden önce ilk 3 rüya tarihleri:');
      dreams.slice(0, 3).forEach((dream, index) => {
        console.log(`Rüya ${index + 1} tarihi:`, 
          dream.date instanceof Date ? dream.date.toISOString() : dream.date);
      });
    }
    
    // Rüyaları zaman aralığına göre filtrele
    const filtered = dreams.filter(dream => {
      try {
        // date bir string olabilir, Date objesi olabilir veya ISO string olabilir
        let dreamDate = parseDateSafely(dream.date);
        
        // Tarih aralığında mı kontrol et
        return dreamDate >= startDate && dreamDate <= today;
      } catch (error) {
        console.error('Rüya filtreleme hatası:', error);
        return false;
      }
    });
    
    console.log(`Filtreleme sonrası: ${filtered.length}/${dreams.length} rüya kaldı`);
    return filtered;
  } catch (error) {
    console.error('filterDreamsByTimeRange hatası:', error);
    return [...dreams]; // Hata durumunda orijinal diziyi döndür
  }
};

/**
 * Veri seti için istatistiksel özet hesaplar
 * @param values Sayısal değerler
 * @returns İstatistiksel özet
 */
export const calculateStatistics = (values: number[]) => {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0 };
  }
  
  // Sıralı dizi
  const sorted = [...values].sort((a, b) => a - b);
  
  // Min, Max, Ortalama
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const avg = sum / sorted.length;
  
  // Medyan
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
  
  return { min, max, avg, median };
};

// Export edilecek fonksiyonlar
const analyticsUtils = {
  parseDateSafely,
  groupByDate,
  calculateMovingAverage,
  aggregateByPeriod,
  normalizeFrequencies,
  sortByFrequency,
  filterDreamsByTimeRange,
  calculateStatistics
};

export default analyticsUtils;