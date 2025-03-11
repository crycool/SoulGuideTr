import AsyncStorage from '@react-native-async-storage/async-storage';
// İçgörüler için update fonksiyonlarını import et
import { generateInsights, getSymbolInsight, quickAnalyzeDream } from './insightGenerator';

// AsyncStorage için anahtar
const INSIGHTS_STORAGE_KEY = '@SoulGuide:insights';
const INSIGHTS_TIMESTAMP_KEY = '@SoulGuide:insights_timestamp';

/**
 * Belirli bir sembolün anlamını getirir
 * @param {string} symbol - Sembol ismi
 * @returns {Promise<Object>} Sembol anlamı
 */
export const getSymbolAnalysis = async (symbol) => {
  try {
    return await getSymbolInsight(symbol);
  } catch (error) {
    console.error('Sembol analizi hatası:', error);
    return { meaning: 'Bu sembol hakkında bilgi bulunamadı' };
  }
};

/**
 * Tek bir rüyanın hızlı analizi
 * @param {string} dreamContent - Rüya içeriği
 * @returns {Promise<Object>} Rüya analizi
 */
export const analyzeSingleDream = async (dreamContent) => {
  try {
    return await quickAnalyzeDream(dreamContent);
  } catch (error) {
    console.error('Hızlı rüya analizi hatası:', error);
    return {
      mainTheme: 'Analiz yapılamadı',
      insights: ['Rüya analizi sırasında bir hata oluştu']
    };
  }
};

/**
 * İçgörüleri yerel depolamadan yükler
 * @returns {Promise<Object|null>} İçgörüler objesi veya null
 */
export const loadInsights = async () => {
  try {
    const storedInsights = await AsyncStorage.getItem(INSIGHTS_STORAGE_KEY);
    
    if (!storedInsights) {
      console.log('Depolanmış içgörü bulunamadı, yeni içgörüler oluşturuluyor...');
      return await refreshInsights();
    }
    
    return JSON.parse(storedInsights);
  } catch (error) {
    console.error('İçgörü yükleme hatası:', error);
    return null;
  }
};

/**
 * İçgörüleri yeniden oluşturur ve kaydeder
 * @param {boolean} forceRefresh - Zorla yenileme yapılmalı mı
 * @returns {Promise<Object>} Yeni içgörüler objesi
 */
export const refreshInsights = async (forceRefresh = false) => {
  try {
    // Yeni içgörüler oluştur
    const newInsights = await generateInsights(forceRefresh);
    
    // Log kontrolü
    console.log('Yeni içgörüler oluşturuldu:', {
      mainInsight: newInsights.mainInsight,
      subInsightsCount: newInsights.subInsights?.length || 0,
      hasPattern: Boolean(newInsights.pattern),
      hasSuggestion: Boolean(newInsights.suggestion),
      dreamCount: newInsights.dreamCount
    });
    
    // Oluşturulan içgörüleri kaydet
    await AsyncStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(newInsights));
    
    // Son güncelleme zamanını kaydet
    await AsyncStorage.setItem(INSIGHTS_TIMESTAMP_KEY, new Date().toISOString());
    
    return newInsights;
  } catch (error) {
    console.error('İçgörü yenileme hatası:', error);
    throw error;
  }
};

/**
 * İçgörülerin son güncelleme zamanını kontrol eder
 * @returns {Promise<boolean>} İçgörüler güncel mi
 */
export const areInsightsUpToDate = async () => {
  try {
    const lastUpdate = await AsyncStorage.getItem(INSIGHTS_TIMESTAMP_KEY);
    
    if (!lastUpdate) return false;
    
    const lastUpdateTime = new Date(lastUpdate).getTime();
    const currentTime = new Date().getTime();
    
    // Son 24 saat içinde güncellendiyse true döndür
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return (currentTime - lastUpdateTime) < oneDayInMs;
  } catch (error) {
    console.error('İçgörü zaman kontrolü hatası:', error);
    return false;
  }
};

/**
 * Yeni rüya eklendiğinde içgörüleri günceller
 * @returns {Promise<boolean>} Güncelleme başarılı mı
 */
export const updateInsightsOnNewDream = async () => {
  try {
    // İçgörüleri yenile
    await refreshInsights();
    return true;
  } catch (error) {
    console.error('Yeni rüya sonrası içgörü güncelleme hatası:', error);
    return false;
  }
};

export default {
  loadInsights,
  refreshInsights,
  areInsightsUpToDate,
  updateInsightsOnNewDream,
  getSymbolAnalysis,
  analyzeSingleDream
};