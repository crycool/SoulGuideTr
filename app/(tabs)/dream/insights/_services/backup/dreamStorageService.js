import AsyncStorage from '@react-native-async-storage/async-storage';

const DREAMS_STORAGE_KEY = 'dreams';

/**
 * Tarihi güvenli bir şekilde işler ve bir Date objesi döndürür
 */
const parseDateSafely = (dateInput) => {
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
};

/**
 * Tüm rüyaları getir
 */
export const getDreams = async () => {
  try {
    const dreamsJSON = await AsyncStorage.getItem(DREAMS_STORAGE_KEY);
    if (dreamsJSON) {
      const dreams = JSON.parse(dreamsJSON);
      
      // Tarihleri güvenli bir şekilde dönüştür
      return dreams.map((dream) => {
        try {
          // Tarih alanlarını güvenli bir şekilde dönüştür
          const safeDate = parseDateSafely(dream.date);
          const safeCreatedAt = parseDateSafely(dream.createdAt);
          const safeUpdatedAt = parseDateSafely(dream.updatedAt);
          
          // Tarihlerin ISO string olarak saklanması
          return {
            ...dream,
            date: safeDate,
            createdAt: safeCreatedAt,
            updatedAt: safeUpdatedAt
          };
        } catch (conversionError) {
          console.error('Tarih dönüştürme hatası:', conversionError, dream);
          
          // Hata durumunda geçerli tarih kullan
          const now = new Date();
          return {
            ...dream,
            date: now,
            createdAt: now,
            updatedAt: now
          };
        }
      });
    }
    return [];
  } catch (error) {
    console.error('Error getting dreams:', error);
    return []; // Hata durumunda boş dizi döndür
  }
};

/**
 * ID'ye göre rüya getir
 */
export const getDreamById = async (id) => {
  try {
    const dreams = await getDreams();
    const dream = dreams.find(d => d.id === id);
    return dream || null;
  } catch (error) {
    console.error('Error getting dream by ID:', error);
    return null; // Hata durumunda null döndür
  }
};

/**
 * Yardımcı fonksiyon: ID oluştur
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export default {
  getDreams,
  getDreamById
};