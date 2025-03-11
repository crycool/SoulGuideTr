/**
 * Tarihi güvenli bir şekilde işler ve bir Date objesi döndürür
 * @param dateInput Tarih girdisi (string, timestamp, Date objesi vb olabilir)
 * @returns Geçerli bir Date objesi veya şu anki zaman
 */
export const parseDateSafely = (dateInput: any): Date => {
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

// Default export for Expo Router compatibility
export default {
  parseDateSafely
};