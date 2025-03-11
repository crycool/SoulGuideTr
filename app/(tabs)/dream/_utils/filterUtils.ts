import { DreamRecord, DreamFilterOptions } from './messageTypes';

/**
 * Rüyaları filtreler ve sıralar
 */
export const applyFilters = (
  dreams: DreamRecord[],
  options: DreamFilterOptions
): DreamRecord[] => {
  let filteredDreams = [...dreams];
  
  // Tarih aralığı filtresi
  if (options.dateRange) {
    if (options.dateRange.startDate) {
      filteredDreams = filteredDreams.filter(
        dream => new Date(dream.date) >= new Date(options.dateRange!.startDate!)
      );
    }
    
    if (options.dateRange.endDate) {
      filteredDreams = filteredDreams.filter(
        dream => new Date(dream.date) <= new Date(options.dateRange!.endDate!)
      );
    }
  }
  
  // Duygular filtresi
  if (options.emotions && options.emotions.length > 0) {
    filteredDreams = filteredDreams.filter(
      dream => dream.emotions.duringDream.some(emotion => options.emotions!.includes(emotion))
    );
  }
  
  // Temalar filtresi
  if (options.themes && options.themes.length > 0) {
    filteredDreams = filteredDreams.filter(
      dream => dream.themes.some(theme => options.themes!.includes(theme))
    );
  }
  
  // Tag (Arketip) filtresi 
  if (options.tag && options.tag.trim() !== '') {
    const tagLower = options.tag.toLowerCase().trim();
    filteredDreams = filteredDreams.filter(
      dream => dream.tags && dream.tags.some(tag => tag.toLowerCase() === tagLower)
    );
  }
  
  // Sembol filtresi (yeni eklenen)
  if (options.symbol && options.symbol.trim() !== '') {
    const symbolLower = options.symbol.toLowerCase().trim();
    filteredDreams = filteredDreams.filter(
      dream => dream.elements.symbols.some(s => s.toLowerCase() === symbolLower) ||
              (dream.symbols && dream.symbols.some(s => s.toLowerCase() === symbolLower)) // Geriye dönük uyumluluk için
    );
  }
  
  // Metin arama filtresi
  if (options.searchText && options.searchText.trim() !== '') {
    const searchLower = options.searchText.toLowerCase().trim();
    filteredDreams = filteredDreams.filter(
      dream =>
        dream.dreamContent.toLowerCase().includes(searchLower) ||
        dream.personalNotes?.toLowerCase().includes(searchLower) ||
        dream.elements.characters.some(char => char.toLowerCase().includes(searchLower)) ||
        dream.elements.places.some(place => place.toLowerCase().includes(searchLower)) ||
        dream.elements.symbols.some(symbol => symbol.toLowerCase().includes(searchLower))
    );
  }
  
  // Tekrarlayan rüya filtresi
  if (options.isRecurring !== undefined) {
    filteredDreams = filteredDreams.filter(
      dream => dream.isRecurring === options.isRecurring
    );
  }
  
  // Lucid rüya filtresi
  if (options.isLucid !== undefined) {
    filteredDreams = filteredDreams.filter(
      dream => dream.isLucid === options.isLucid
    );
  }
  
  // Sıralama
  filteredDreams.sort((a, b) => {
    let aValue, bValue;
    
    // Sıralanacak değeri belirle
    switch (options.sortBy) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'sleepQuality':
        aValue = a.sleepQuality;
        bValue = b.sleepQuality;
        break;
      case 'dreamClarity':
        aValue = a.dreamClarity;
        bValue = b.dreamClarity;
        break;
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
    }
    
    // Sıralama yönünü belirle
    return options.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
  
  return filteredDreams;
};

// Default export for Expo Router compatibility
const filterUtils = {
  applyFilters
};

export default filterUtils;