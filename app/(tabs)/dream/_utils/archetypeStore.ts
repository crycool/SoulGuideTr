/**
 * Arketip verilerini global olarak saklayan ve önbelleğe alan gelişmiş store
 * Bu, bileşenler arasında veri aktarımı için güvenilir ve performanslı bir mekanizma sağlar
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage için anahtarlar
const ARCHETYPES_STORAGE_KEY = 'SoulGuide_Archetypes';
const SELECTED_ARCHETYPE_KEY = 'SoulGuide_SelectedArchetype';

// Güncel arketip verilerini tutan global değişken (bellek içi önbellek)
let currentArchetypes: string[] = [];
// Seçili arketipi tutan global değişken
let selectedArchetype: string | null = null;
// Verinin yüklenip yüklenmediğini takip eden bayrak
let isLoaded = false;

export const archetypeStore = {
  /**
   * Arketip verilerini sakla (hem bellekte hem de AsyncStorage'da)
   * @param archetypes Saklanacak arketip dizisi
   */
  setArchetypes: async (archetypes: string[]) => {
    console.log('archetypeStore: Arketipler kaydediliyor:', archetypes);
    // Önce bellekte güncelle (hızlı erişim için)
    currentArchetypes = [...archetypes];
    isLoaded = true;
    
    try {
      // Sonra AsyncStorage'a kaydet (kalıcılık için)
      await AsyncStorage.setItem(ARCHETYPES_STORAGE_KEY, JSON.stringify(archetypes));
      console.log('archetypeStore: Arketipler AsyncStorage\'a kaydedildi');
    } catch (error) {
      console.error('archetypeStore: AsyncStorage kaydetme hatası:', error);
    }
    
    return currentArchetypes;
  },

  /**
   * Mevcut arketip verilerini al (önce bellekten, yoksa AsyncStorage'dan)
   * @returns Saklanan arketip dizisi
   */
  getArchetypes: async (): Promise<string[]> => {
    // Eğer zaten bellekte yüklüyse, hemen döndür
    if (isLoaded && currentArchetypes.length > 0) {
      console.log('archetypeStore: Arketipler bellekten alınıyor:', currentArchetypes);
      return [...currentArchetypes];
    }
    
    // Bellekte yoksa, AsyncStorage'dan yüklemeyi dene
    try {
      const storedData = await AsyncStorage.getItem(ARCHETYPES_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('archetypeStore: Arketipler AsyncStorage\'dan yüklendi:', parsedData);
        // Belleğe de kaydet
        currentArchetypes = parsedData;
        isLoaded = true;
        return [...currentArchetypes];
      }
    } catch (error) {
      console.error('archetypeStore: AsyncStorage okuma hatası:', error);
    }
    
    console.log('archetypeStore: Arketip bulunamadı, boş dizi döndürülüyor');
    return [];
  },
  
  /**
   * Mevcut arketip verilerini senkron olarak al (sadece bellekten)
   * Not: Eğer veriler henüz yüklenmemişse boş dizi döner, bu nedenle dikkatli kullanılmalıdır
   * @returns Bellekteki arketip dizisi veya boş dizi
   */
  getArchetypesSync: (): string[] => {
    console.log('archetypeStore: Arketipler senkron olarak alınıyor:', isLoaded ? currentArchetypes : 'henüz yüklenmedi');
    return isLoaded ? [...currentArchetypes] : [];
  },

  /**
   * Mevcut arketip verilerini temizle (hem bellekten hem de AsyncStorage'dan)
   */
  clearArchetypes: async () => {
    console.log('archetypeStore: Arketipler temizleniyor');
    currentArchetypes = [];
    isLoaded = false;
    
    try {
      await AsyncStorage.removeItem(ARCHETYPES_STORAGE_KEY);
      console.log('archetypeStore: Arketipler AsyncStorage\'dan silindi');
    } catch (error) {
      console.error('archetypeStore: AsyncStorage silme hatası:', error);
    }
  },
  
  /**
   * Seçili arketipi ayarla (hem bellekte hem de ihtiyaç halinde AsyncStorage'da saklayacak şekilde)
   * @param name Seçilen arketip adı
   */
  selectArchetype: (name: string) => {
    console.log('archetypeStore: Seçili arketip ayarlanıyor:', name);
    selectedArchetype = name;
    // Sadece bellekte saklanıyor, AsyncStorage'a yazmıyoruz - performans için
    // Gerekirse buraya AsyncStorage kodunu ekleyebilirsiniz
  },

  /**
   * Seçili arketipi temizle
   */
  clearSelectedArchetype: () => {
    console.log('archetypeStore: Seçili arketip temizleniyor');
    selectedArchetype = null;
  },

  /**
   * Seçili arketipin adını getir
   * @returns Seçili arketip adı veya null
   */
  getSelectedArchetype: (): string | null => {
    return selectedArchetype;
  },
  
  /**
   * Verilerin başlatılması (uygulama açılışında çağrılabilir)
   * Bellekte veri yoksa, AsyncStorage'dan yüklemeyi dener
   */
  initialize: async () => {
    // Eğer zaten yüklüyse tekrar yükleme
    if (isLoaded) return;
    
    console.log('archetypeStore: Başlatılıyor');
    await archetypeStore.getArchetypes();

    // Seçili arketipi de başlatabiliriz (isteğe bağlı)
    try {
      const storedSelected = await AsyncStorage.getItem(SELECTED_ARCHETYPE_KEY);
      if (storedSelected) {
        selectedArchetype = storedSelected;
        console.log('archetypeStore: Seçili arketip yüklendi:', selectedArchetype);
      }
    } catch (error) {
      console.error('archetypeStore: Seçili arketip yükleme hatası:', error);
    }
  }
};

export default archetypeStore;