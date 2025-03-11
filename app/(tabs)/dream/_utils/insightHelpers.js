/**
 * İçgörü özellikleri için yardımcı fonksiyonlar
 */

// Bir sonraki kilometre taşını hesapla (5'in katları)
export const getNextMilestone = (dreamCount) => {
  return Math.ceil(dreamCount / 5) * 5 + 5;
};

// Rüya sayısına göre içgörü seviyesini hesapla (1-5 arası)
export const getInsightLevel = (dreamCount) => {
  return Math.min(5, Math.max(1, Math.ceil(dreamCount / 5)));
};

// Seviyeye göre açıklama metni
export const getLevelDescription = (level) => {
  switch (level) {
    case 1:
      return 'Bilinçaltınızın ilk mesajlarını alıyorsunuz. Daha fazla rüya kaydederek örüntüleri keşfedin.';
    case 2:
      return 'Rüyalarınız arasında bağlantılar kurulmaya başladı. Sembolleriniz anlam kazanıyor.';
    case 3:
      return 'Bilinçaltınızın örüntüleri belirginleşmeye başladı. Tekrarlayan temalar ve duygular ortaya çıkıyor.';
    case 4:
      return 'Bilinçaltınızla güçlü bir iletişim kurdunuz. Rüyalarınız size rehberlik ediyor.';
    case 5:
      return 'Bilinçaltınızın derinliklerini keşfettiniz. Rüyalarınızın dili size açık şekilde konuşuyor.';
    default:
      return 'Rüya kaydetmeye devam edin ve bilinçaltınızı keşfedin.';
  }
};

// Seviyeye göre kilidini açacak içgörü sayısı
export const getUnlockableInsightCount = (level) => {
  switch (level) {
    case 1:
      return 1; // Seviye 1'de 1 içgörü açık
    case 2:
      return 2; // Seviye 2'de 2 içgörü açık
    case 3:
      return 3; // Seviye 3'de 3 içgörü açık
    case 4:
      return 4; // Seviye 4'de 4 içgörü açık
    case 5:
      return 5; // Seviye 5'de tüm içgörüler açık
    default:
      return 1;
  }
};

// Rüya sayısına göre gereken bir sonraki içgörü kilidi açma sayısı
export const getNextInsightUnlock = (dreamCount) => {
  const currentLevel = getInsightLevel(dreamCount);
  const nextLevel = currentLevel + 1;
  return nextLevel * 5 - dreamCount;
};

// Açık/Kilili içgörüleri bulmak için yardımcı işlev
export const getInsightStatus = (insights, dreamCount) => {
  if (!insights || !insights.subInsights) {
    return {
      lockedCount: 0,
      unlockedCount: 0,
      lockedInsights: [],
      unlockedInsights: []
    };
  }
  
  const level = getInsightLevel(dreamCount);
  const unlockedCount = getUnlockableInsightCount(level);
  
  const unlockedInsights = insights.subInsights.slice(0, unlockedCount);
  const lockedInsights = insights.subInsights.slice(unlockedCount);
  
  return {
    lockedCount: lockedInsights.length,
    unlockedCount: unlockedInsights.length,
    lockedInsights,
    unlockedInsights
  };
};

export default {
  getNextMilestone,
  getInsightLevel,
  getLevelDescription,
  getUnlockableInsightCount,
  getNextInsightUnlock,
  getInsightStatus
};