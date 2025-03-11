/**
 * Sembol verilerini global olarak saklayan ve yöneten basit bir store
 * Sayfalar arası navigasyonda sembol seçimini hatırlamak için kullanılır
 */

// Seçili sembolü tutan global değişken
let selectedSymbol: string | null = null;

export const symbolStore = {
  /**
   * Seçili sembolü ayarla
   * @param name Seçilen sembolün adı
   */
  selectSymbol: (name: string) => {
    console.log('symbolStore: Seçili sembol ayarlanıyor:', name);
    selectedSymbol = name;
  },

  /**
   * Seçili sembolü temizle
   */
  clearSelectedSymbol: () => {
    console.log('symbolStore: Seçili sembol temizleniyor');
    selectedSymbol = null;
  },

  /**
   * Seçili sembolün adını getir
   * @returns Seçili sembol adı veya null
   */
  getSelectedSymbol: (): string | null => {
    return selectedSymbol;
  }
};

export default symbolStore;