import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { ActivityIndicator, Chip, Text } from 'react-native-paper';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import CustomBackButton from '../_components/CustomBackButton';

// Servisler
import { getDreams, DreamRecord } from '../_services/dreamStorageService';
import { 
  dreamAnalyticsService,
  EmotionData,
  ThemeData,
  QualityData,
  FrequencyData,
  SymbolData,
  AnalyticsSummary as AnalyticsSummaryType,
  ArchetypeData
} from '../_services/dreamAnalyticsService';

import { filterDreamsByTimeRange } from '../_utils/analyticsUtils';

// Komponentler
import AnalyticsSummary from '../_components/analytics/AnalyticsSummary';
import EmotionsChart from '../_components/analytics/EmotionsChart';
import ThemesChart from '../_components/analytics/ThemesChart';
import DreamQualityChart from '../_components/analytics/DreamQualityChart';
import DreamFrequencyChart from '../_components/analytics/DreamFrequencyChart';
import SymbolsCloud from '../_components/analytics/SymbolsCloud';
import TimePatternChart from '../_components/analytics/TimePatternChart';
import ArchetypesChart from '../_components/analytics/ArchetypesChart';
import EmptyAnalytics from '../_components/analytics/EmptyAnalytics';
import InsightPromotionCard from './_components/InsightPromotionCard';

type TimeRange = 7 | 30 | 90 | null; // null = tüm zamanlar

// Analiz bileşenlerinin tipleri
type AnalyticComponentType = 
  | 'filters'
  | 'dataInfo'
  | 'summary' 
  | 'emotions' 
  | 'themes' 
  | 'archetypes'
  | 'quality'
  | 'frequency'
  | 'timePatterns'
  | 'symbols'
  | 'insightPromotion'
  | 'empty';

// FlatList için veri öğeleri
interface AnalyticItem {
  id: string;
  type: AnalyticComponentType;
  data?: any;
}

export default function DreamAnalyticsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  // Başlığı ayarla
  // Bu kısmı kaldırıyoruz, _layout.tsx'de zaten ayarladık
  /*
  useEffect(() => {
    // @ts-ignore - navigation.setOptions eksik tip bilgisi
    navigation.setOptions({
      title: 'Rüya Analitikleri'
    });
  }, [navigation]);
  */

  // FlatList referansı oluştur
  const flatListRef = useRef<FlatList>(null);
  
  // URL parametrelerini al
  const { scrollY } = useLocalSearchParams<{ scrollY?: string }>();
  
  // Bir önceki pozisyonu sakla (localStorage/AsyncStorage yerine)
  const lastScrollPosition = useRef(0);
  
  // State
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false);
  const [filteredDreams, setFilteredDreams] = useState<DreamRecord[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Analiz verileri
  const [summary, setSummary] = useState<AnalyticsSummaryType | null>(null);
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [qualityData, setQualityData] = useState<QualityData[]>([]);
  const [frequencyData, setFrequencyData] = useState<FrequencyData[]>([]);
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [timePatterns, setTimePatterns] = useState<TimePatternData>({dayOfWeek: {}, timeOfDay: {}});
  const [archetypes, setArchetypes] = useState<ArchetypeData[]>([]);
  
  // FlatList için veri öğeleri
  const [analyticsItems, setAnalyticsItems] = useState<AnalyticItem[]>([]);

  // Verilerin yüklenmesi sonrası scroll pozisyonunu geri yükle
  useEffect(() => {
    if (!isLoading && analyticsItems.length > 0 && !hasRestoredScroll && lastScrollPosition.current > 0) {
      setTimeout(() => {
        scrollToOffset(lastScrollPosition.current, false);
        setHasRestoredScroll(true);
      }, 300);
    }
  }, [isLoading, analyticsItems, hasRestoredScroll, scrollToOffset]);

  // Scroll pozisyonunu ayarla
  const scrollToOffset = useCallback((position: number, animated: boolean = false) => {
    if (position > 0 && flatListRef.current) {
      try {
        console.log('scrollToOffset çağrıldı. Pozisyon:', position);
        flatListRef.current.scrollToOffset({ offset: position, animated });
        console.log('scrollToOffset başarılı');
      } catch (error) {
        console.error('Scroll hatası:', error);
      }
    }
  }, []);

  // URL'den scroll pozisyonunu geri yükle
  useEffect(() => {
    if (scrollY && !hasRestoredScroll && !isLoading && analyticsItems.length > 0) {
      const position = parseInt(scrollY, 10);
      if (!isNaN(position)) {
        console.log('URL\'den scroll pozisyonu geri yükleniyor:', position);
        setTimeout(() => {
          scrollToOffset(position, false);
          setHasRestoredScroll(true);
        }, 300);
      }
    }
  }, [scrollY, hasRestoredScroll, isLoading, analyticsItems, scrollToOffset]);


  // Scroll olayı işleyici - useCallback ile optimize edildi
  const handleScroll = useCallback(event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    // Her scroll pozisyonunu kaydet (daha hassas takip için)
    setScrollPosition(currentOffset);
    // Son scroll pozisyonunu ref'e kaydet
    lastScrollPosition.current = currentOffset;
  }, []);
  
  // Rüya verilerini yükle
  const loadDreams = useCallback(async () => {
    try {
      setIsLoading(true);
      const dreamRecords = await getDreams();
      console.log('Yüklenen rüya kayıtları:', dreamRecords.length);
      setDreams(dreamRecords);
      
      // Hemen verileri filtrele
      if (dreamRecords.length > 0) {
        const filtered = filterDreamsByTimeRange(dreamRecords, timeRange);
        setFilteredDreams(filtered);
        // isLoading false durumu filteredDreams effect'inde ayarlanıyor
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Rüya verileri yüklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Rüya verileri yüklenirken bir sorun oluştu');
      setIsLoading(false);
    }
  }, [timeRange]);

  // Sayfa odaklandığında verileri yenile
  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect tetiklendi');
      
      if (scrollY) {
        const position = parseInt(scrollY, 10);
        if (!isNaN(position)) {
          console.log('useFocusEffect: scrollY parametresi bulundu:', position);
          lastScrollPosition.current = position;
        }
      }

      setHasRestoredScroll(false);
      loadDreams();

    }, [loadDreams, scrollY])
  );

  // Zaman aralığına göre verileri filtrele
  useEffect(() => {
    if (dreams.length > 0) {
      try {
        console.log('Filtreleme yapılıyor, rüya sayısı:', dreams.length);
        const filtered = filterDreamsByTimeRange(dreams, timeRange);
        console.log('Filtrelenmiş rüya sayısı:', filtered.length);
        setFilteredDreams(filtered);
      } catch (error) {
        console.error('Filtreleme hatası:', error);
        // Filtreleme başarısız olursa boş dizi kullan
        setFilteredDreams([]);
      }
    } else {
      // Rüya yoksa filtrelenmiş diziyi sıfırla
      setFilteredDreams([]);
    }
  }, [dreams, timeRange]);

  // Filtrelenmiş veriler değiştiğinde analizleri güncelle ve gerekirse scroll pozisyonunu ayarla
  useEffect(() => {
    try {
      if (filteredDreams && filteredDreams.length > 0) {
        console.log('Analizler güncelleniyor, veri sayısı:', filteredDreams.length);
        
        // Analiz verilerini hesapla
        const newSummary = dreamAnalyticsService.getAnalyticsSummary(filteredDreams);
        setSummary(newSummary);
        console.log('Summary güncellendi:', newSummary ? 'Evet' : 'Hayır');
        
        const newEmotions = dreamAnalyticsService.getEmotionsDistribution(filteredDreams);
        setEmotions(newEmotions);
        console.log('Emotions güncellendi, adet:', newEmotions.length);
        
        const newThemes = dreamAnalyticsService.getThemesDistribution(filteredDreams);
        setThemes(newThemes);
        console.log('Themes güncellendi, adet:', newThemes.length);
        
        const newQualityData = dreamAnalyticsService.getDreamQualityTrend(filteredDreams);
        setQualityData(newQualityData);
        console.log('QualityData güncellendi, adet:', newQualityData.length);
        
        const newFrequencyData = dreamAnalyticsService.getDreamFrequency(filteredDreams, 'week');
        setFrequencyData(newFrequencyData);
        console.log('FrequencyData güncellendi, adet:', newFrequencyData.length);
        
        const newSymbols = dreamAnalyticsService.getTopSymbols(filteredDreams, 30);
        setSymbols(newSymbols);
        console.log('Symbols güncellendi, adet:', newSymbols.length);
        
        // Arketipleri getir
        const newArchetypes = dreamAnalyticsService.getArchetypesDistribution(filteredDreams);
        setArchetypes(newArchetypes);
        console.log('Archetypes güncellendi, adet:', newArchetypes.length);
        
        const newTimePatterns = dreamAnalyticsService.getTimePatterns(filteredDreams);
        setTimePatterns(newTimePatterns);
        console.log('TimePatterns güncellendi:', newTimePatterns ? 'Evet' : 'Hayır');
        
        // Analiz yüklendikten sonra scroll pozisyonu için setIsLoading(false) tetikler
        setIsLoading(false);
      } else {
        // Boş analiz verileri
        console.log('Filtrelenmiş veri bulunamadı, analizler sıfırlanıyor');
        setSummary(null);
        setEmotions([]);
        setThemes([]);
        setQualityData([]);
        setFrequencyData([]);
        setSymbols([]);
        setArchetypes([]);
        setTimePatterns({dayOfWeek: {}, timeOfDay: {}});
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Analiz güncelleme hatası:', error);
      // Hata durumunda boş veriler atama
      setSummary(null);
      setEmotions([]);
      setThemes([]);
      setQualityData([]);
      setFrequencyData([]);
      setSymbols([]);
      setTimePatterns({dayOfWeek: {}, timeOfDay: {}});
      setIsLoading(false);
    }
  }, [filteredDreams]);
  
  // FlatList veri öğelerini güncelle
  useEffect(() => {
    if (!isLoading) {
      const items: AnalyticItem[] = [];
      
      // Filtreleri her zaman ekle
      items.push({ id: 'filters', type: 'filters' });
      
      if (filteredDreams.length > 0) {
        // Veri bilgisini ekle
        items.push({ id: 'dataInfo', type: 'dataInfo' });
        
        // Özet varsa ekle
        if (summary && Object.keys(summary).length > 0) {
          items.push({ id: 'summary', type: 'summary', data: summary });
        }
        
        // Duygular varsa ekle
        if (emotions && emotions.length > 0) {
          items.push({ id: 'emotions', type: 'emotions', data: emotions });
        }
        
        // Temalar varsa ekle
        if (themes && themes.length > 0) {
          items.push({ id: 'themes', type: 'themes', data: themes });
        }
        
        // Arketipler varsa ekle
        if (archetypes && archetypes.length > 0) {
          items.push({ id: 'archetypes', type: 'archetypes', data: archetypes });
        }
        
        // Kalite verileri varsa ekle
        if (qualityData && qualityData.length > 0) {
          items.push({ id: 'quality', type: 'quality', data: qualityData });
        }
        
        // Frekans verileri varsa ekle
        if (frequencyData && frequencyData.length > 0) {
          items.push({ id: 'frequency', type: 'frequency', data: frequencyData });
        }
        
        // Zaman örüntüleri varsa ekle
        if (timePatterns && timePatterns.dayOfWeek && Object.keys(timePatterns.dayOfWeek).length > 0) {
          items.push({ id: 'timePatterns', type: 'timePatterns', data: timePatterns });
        }
        
        // Semboller varsa ekle
        if (symbols && symbols.length > 0) {
          items.push({ id: 'symbols', type: 'symbols', data: symbols });
        }
        
        // İçgörü promosyonu kartını ekle
        items.push({ id: 'insightPromotion', type: 'insightPromotion', data: { dreamCount: dreams.length } });
      } else if (!isLoading) {
        // Veri yoksa boş analiz kartını ekle
        items.push({ id: 'empty', type: 'empty' });
      }
      
      setAnalyticsItems(items);
    }
  }, [
    isLoading, 
    filteredDreams, 
    dreams, 
    summary, 
    emotions, 
    themes, 
    archetypes, 
    qualityData, 
    frequencyData, 
    timePatterns, 
    symbols
  ]);

  // Yenileme işlemi
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDreams();
    setRefreshing(false);
  }, [loadDreams]);

  // Rüya sohbetine yönlendirme
  const navigateToDreamChat = () => {
    router.push('/(tabs)/dream/chat');
  };

  // Duygulara göre arşive yönlendirme
  const handleEmotionFilter = (emotion: string) => {
    router.push({
      pathname: '/(tabs)/dream/archive',
      params: { 
        filter: 'emotion', 
        value: emotion,
        scrollY: scrollPosition.toString() // Scroll pozisyonunu URL'e ekle
      }
    });
  };

  // Temalara göre arşive yönlendirme
  const handleThemeFilter = (theme: string) => {
    router.push({
      pathname: '/(tabs)/dream/archive',
      params: { 
        filter: 'theme', 
        value: theme,
        scrollY: scrollPosition.toString() // Scroll pozisyonunu URL'e ekle
      }
    });
  };

  // Sembollere göre arşive yönlendirme
  const handleSymbolFilter = (symbol: string) => {
    router.push({
      pathname: '/(tabs)/dream/archive',
      params: { 
        filter: 'symbol', 
        value: symbol,
        scrollY: scrollPosition.toString() // Scroll pozisyonunu URL'e ekle
      }
    });
  };

  // Arketiplere göre arşive yönlendirme
  const handleArchetypeFilter = (archetype: string) => {
    router.push({
      pathname: '/(tabs)/dream/archive',
      params: { 
        filter: 'tag', 
        value: archetype,
        scrollY: scrollPosition.toString() // Scroll pozisyonunu URL'e ekle
      }
    });
  };

  // Zaman aralığı filtresini değiştirme
  const handleTimeRangeChange = (range: TimeRange) => {
    console.log('Zaman aralığı değişikliği:', { from: timeRange, to: range });
    
    // Önce loading durumuna geç (scroll pozisyonu sıfırlanır)
    setIsLoading(true);
    setTimeRange(range);
    
    // Hemen veriyi filtrele ve analiz güncelleme işlemini tetikle
    if (dreams.length > 0) {
      try {
        const filtered = filterDreamsByTimeRange(dreams, range);
        console.log(`Filtreleme yapıldı: ${filtered.length}/${dreams.length} rüya seçildi`);
        setFilteredDreams(filtered);
        // filteredDreams useEffect'i analizleri güncelleyecek
      } catch (error) {
        console.error('Filtreleme hatası:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  // Veri öğelerini render etme
  const renderItem = ({ item }: ListRenderItemInfo<AnalyticItem>) => {
    switch (item.type) {
      case 'filters':
        return (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterLabel}>Zaman Aralığı:</Text>
            <FlatList
              data={[
                { range: 7, label: 'Son 7 Gün', icon: 'calendar-week' },
                { range: 30, label: 'Son 30 Gün', icon: 'calendar-month' },
                { range: 90, label: 'Son 90 Gün', icon: 'calendar-range' },
                { range: null, label: 'Tüm Zamanlar', icon: 'calendar' }
              ]}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: filterItem }) => (
                <TouchableOpacity 
                  style={[
                    styles.timeRangeButton, 
                    timeRange === filterItem.range && styles.selectedTimeRangeButton
                  ]} 
                  onPress={() => handleTimeRangeChange(filterItem.range)}
                >
                  <MaterialCommunityIcons 
                    name={filterItem.icon} 
                    size={18} 
                    color={timeRange === filterItem.range ? theme.colors.text : theme.colors.primary} 
                  />
                  <Text style={[
                    styles.timeRangeButtonText, 
                    timeRange === filterItem.range && styles.selectedTimeRangeText
                  ]}>
                    {filterItem.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(filterItem) => `filter-${filterItem.range}`}
              contentContainerStyle={styles.filterChips}
            />
          </View>
        );
        
      case 'dataInfo':
        return (
          <View style={styles.dataInfoContainer}>
            <MaterialCommunityIcons name="information-outline" size={16} color={theme.colors.text} />
            <Text style={styles.dataInfoText}>
              Analiz {filteredDreams.length} rüya kaydına dayanmaktadır
              {timeRange && ` (Son ${timeRange} gün)`}
            </Text>
          </View>
        );
        
      case 'summary':
        return <AnalyticsSummary summary={item.data} />;
        
      case 'emotions':
        return <EmotionsChart emotions={item.data} onEmotionPress={handleEmotionFilter} />;
        
      case 'themes':
        return <ThemesChart themes={item.data} onThemePress={handleThemeFilter} scrollViewRef={flatListRef} />;
        
      case 'archetypes':
        return <ArchetypesChart archetypes={item.data} onArchetypePress={handleArchetypeFilter} scrollViewRef={flatListRef} />;
        
      case 'quality':
        return <DreamQualityChart qualityData={item.data} />;
        
      case 'frequency':
        return <DreamFrequencyChart frequencyData={item.data} />;
        
      case 'timePatterns':
        return <TimePatternChart timePatterns={item.data} />;
        
      case 'symbols':
        return <SymbolsCloud symbols={item.data} scrollViewRef={flatListRef} />;
        
      case 'insightPromotion':
        console.log("InsightPromotionCard dreamCount:", item.data.dreamCount); // Debug log
        return <InsightPromotionCard dreamCount={item.data.dreamCount} />;
        
      case 'empty':
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Seçili zaman aralığında veri bulunamadı</Text>
            <TouchableOpacity 
              style={styles.emptyButton} 
              onPress={navigateToDreamChat}
            >
              <Text style={styles.emptyButtonText}>Yeni Rüya Ekle</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  // Yeterli veri yoksa EmptyAnalytics göster
  if (!isLoading && dreams.length === 0) {
    console.log('EmptyAnalytics gösteriliyor: Hiç rüya verisi yok');
    return (
      <>
        <View style={styles.header}>
          <CustomBackButton />
          <Text style={styles.headerTitle}>Rüya Analizleri</Text>
          <View style={{width: 40}} />
        </View>
        <EmptyAnalytics onPress={navigateToDreamChat} />
      </>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>Rüya Analizleri</Text>
        <View style={{width: 40}} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
          <Text style={styles.loadingText}>Analizler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={analyticsItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.container}  // Add container style
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEventThrottle={16}
          onScroll={handleScroll}
          initialNumToRender={4} // İlk görünümde render edilecek öğe sayısı
          maxToRenderPerBatch={3} // Bir işlem döngüsünde render edilecek maksimum öğe sayısı
          windowSize={10} // Görünüm penceresinin boyutu (daha düşük değer = daha iyi performans)
          removeClippedSubviews={true} // Ekran dışı görünümleri bellekten kaldır
          ListEmptyComponent={!isLoading ? (
            <EmptyAnalytics onPress={navigateToDreamChat} />
          ) : null}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 80, // Bottom navigation için alan bırakma
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  filtersContainer: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  filterLabel: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  filterChips: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.xs,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  timeRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}15`, // 15 is hex for 0.08 opacity
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`, // 30 is hex for 0.19 opacity
  },
  selectedTimeRangeButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeRangeButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  selectedTimeRangeText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
  dataInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderRadius: theme.borderRadius.md,
  },
  dataInfoText: {
    fontSize: theme.typography.fontSize.xs,
    marginLeft: theme.spacing.sm,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  emptyButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
});
