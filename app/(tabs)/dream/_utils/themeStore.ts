/**
 * Tema Store - Seçilen temaları kaydetmek ve yönetmek için basit bir store
 */

class ThemeStore {
  private selectedTheme: string | null = null;
  
  /**
   * Bir temayı seç ve kaydet
   */
  selectTheme(themeName: string) {
    this.selectedTheme = themeName;
    console.log('Tema seçildi:', themeName);
  }
  
  /**
   * Seçilen temayı temizle
   */
  clearSelectedTheme() {
    this.selectedTheme = null;
    console.log('Seçili tema temizlendi');
  }
  
  /**
   * Seçilen temayı al
   */
  getSelectedTheme(): string | null {
    return this.selectedTheme;
  }
}

// Singleton instance
const themeStore = new ThemeStore();
export default themeStore;