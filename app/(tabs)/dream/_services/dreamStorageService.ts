import AsyncStorage from '@react-native-async-storage/async-storage';
import { DreamRecord } from '../_utils/messageTypes';
// İçgörü servisini import et
import { updateInsightsOnNewDream } from '../insights/_services/insightStorage';

const DREAMS_STORAGE_KEY = 'dreams';

/**
 * Tarihi güvenli bir şekilde işler ve bir Date objesi döndürür
 * @param dateInput Tarih girdisi (string, timestamp, Date objesi vb olabilir)
 * @returns Geçerli bir Date objesi veya şu anki zaman
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
export const getDreams = async (): Promise<DreamRecord[]> => {
  try {
    const dreamsJSON = await AsyncStorage.getItem(DREAMS_STORAGE_KEY);
    if (dreamsJSON) {
      const dreams = JSON.parse(dreamsJSON);
      
      // Tarihleri güvenli bir şekilde dönüştür
      return dreams.map((dream: any) => {
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
export const getDreamById = async (id: string): Promise<DreamRecord | null> => {
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
 * Yeni rüya kaydet
 */
export const saveDream = async (dream: Omit<DreamRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DreamRecord> => {
  try {
    const dreams = await getDreams();
    
    const newDream: DreamRecord = {
      ...dream,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Debug: Arketipleri kontrol et
    console.log('Kaydedilen rüya arketipleri:', newDream.tags);
    console.log('Kaydedilen rüya arketipleri türü:', typeof newDream.tags);
    console.log('Kaydedilen rüya arketipleri uzunluğu:', newDream.tags?.length || 0);
    
    dreams.push(newDream);
    await AsyncStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(dreams));
    
    // İçgörüleri güncellemek için servis çağrısı yap
    try {
      // Asenkron olarak çağır ama bekleme
      updateInsightsOnNewDream()
        .then(() => console.log('İçgörüler yeni rüya sonrası güncellendi'))
        .catch(err => console.warn('İçgörü güncelleme hatası (kritik değil):', err));
    } catch (insightError) {
      // Hata olursa loglama yap ama ana işlemi etkilemesin
      console.warn('İçgörü güncellemesi sırasında hata (kritik değil):', insightError);
    }
    
    return newDream;
  } catch (error) {
    console.error('Error saving dream:', error);
    throw error;
  }
};

/**
 * Mevcut rüyayı güncelle
 */
export const updateDream = async (id: string, updates: Partial<DreamRecord>): Promise<DreamRecord> => {
  try {
    const dreams = await getDreams();
    const index = dreams.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Dream not found');
    }
    
    dreams[index] = {
      ...dreams[index],
      ...updates,
      updatedAt: new Date()
    };
    
    await AsyncStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(dreams));
    
    return dreams[index];
  } catch (error) {
    console.error('Error updating dream:', error);
    throw error;
  }
};

/**
 * Rüyayı sil
 */
export const deleteDream = async (id: string): Promise<void> => {
  try {
    const dreams = await getDreams();
    const filteredDreams = dreams.filter(d => d.id !== id);
    
    await AsyncStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(filteredDreams));
  } catch (error) {
    console.error('Error deleting dream:', error);
    throw error;
  }
};

/**
 * Yardımcı fonksiyon: ID oluştur
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Export edilecek fonksiyonlar
const dreamStorageService = {
  getDreams,
  getDreamById,
  saveDream,
  updateDream,
  deleteDream
};

export default dreamStorageService;