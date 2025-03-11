/**
 * Basitleştirilmiş Dream Analytics Servisi
 * InsightGenerator için gerekli minimum fonksiyonlar
 */

/**
 * Sembol frekansı analizi
 */
export const getSymbolsFrequency = (dreams) => {
  const symbolCounts = {};
    
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
};

/**
 * Duygu dağılımı analizi 
 */
export const getEmotionsDistribution = (dreams) => {
  try {
    // Rüya listesini kontrol et
    if (!dreams || !Array.isArray(dreams) || dreams.length === 0) {
      console.log('Duygu dağılımı için veri yok');
      return [];
    }

    // Duygu sıklıklarını hesapla
    const emotionCounts = {};
      
    dreams.forEach(dream => {
      if (dream.emotions && dream.emotions.duringDream && Array.isArray(dream.emotions.duringDream) && dream.emotions.duringDream.length > 0) {
        dream.emotions.duringDream.forEach(emotion => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      }
    });

    // Renk paleti (temsili)
    const emotionColors = {
      joy: '#FFD700',
      fear: '#800080',
      sadness: '#1E90FF',
      anger: '#FF4500',
      surprise: '#00CED1',
      disgust: '#228B22',
      neutral: '#A9A9A9',
      anxiety: '#BA55D3',
      peace: '#98FB98',
      confusion: '#DEB887',
      excitement: '#FF69B4',
      love: '#FF1493'
    };
        
    // Duygu dağılımı verisi oluştur
    return Object.keys(emotionCounts).map(emotion => ({
      name: emotion,
      value: emotionCounts[emotion],
      color: emotionColors[emotion.toLowerCase()] || '#808080'
    })).sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('getEmotionsDistribution hatası:', error);
    return [];
  }
};

/**
 * Zaman örüntüleri analizi
 */
export const getTimePatterns = (dreams) => {
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
  const dayOfWeek = {};
  dayNames.forEach(day => dayOfWeek[day] = 0);
  
  const timeOfDay = {};
  Object.keys(timeSlots).forEach(slot => timeOfDay[slot] = 0);
  
  // Rüyaları döngüyle işle
  dreams.forEach(dream => {
    try {
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
    } catch (error) {
      console.error('Tarih işleme hatası:', error);
    }
  });
  
  return { dayOfWeek, timeOfDay };
};

export default {
  getSymbolsFrequency,
  getEmotionsDistribution,
  getTimePatterns
};