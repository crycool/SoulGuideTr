import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert, TouchableOpacity } from 'react-native';
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

  // ScrollView referansı oluştur
  const scrollViewRef = useRef(null);
  
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

  // Verilerin başarıyla yüklenmesini takip eden ayrı bir useEffect
  useEffect(() => {
    if (!isLoading && filteredDreams.length > 0 && !hasRestoredScroll && lastScrollPosition.current > 0) {
      // Veri yüklendikten sonra scroll pozisyonunu geri yükle
      setTimeout(() => {
        if (scrollViewRef.current) {
          try {
            console.log('SCROLL POZISYONU AYARLANIYOR:', lastScrollPosition.current);
            // @ts-ignore
            scrollViewRef.current.scrollTo({ y: lastScrollPosition.current, animated: false });
            setHasRestoredScroll(true);
          } catch (error) {
            console.error('Scroll hatası:', error);
          }
        }
      }, 1000); // Daha uzun süre bekle - sayfanın tamamen yüklenmesi için
    }
  }, [isLoading, filteredDreams, hasRestoredScroll]);

  // Sayfa yorumlanırken scroll yapma
  const setScrollOnMount = useCallback((position: number) => {
    if (position > 0 && scrollViewRef.current) {
      setTimeout(() => {
        try {
          console.log('setScrollOnMount çağrıldı. Pozisyon:', position);
          // ScrollView için doğru metot scrollTo'dur
          // @ts-ignore
          scrollViewRef.current.scrollTo({ y: position, animated: false });
          console.log('scrollTo başarılı');
        } catch (error) {
          console.error('Scroll hatası:', error);
        }
      }, 800);
    }
  }, []);

  // Burada scroll pozisyonunu geri yüklemek için filtrelenmiş verilerin hazır olmasını bekliyoruz
  useEffect(() => {
    if (scrollY && !hasRestoredScroll && !isLoading && filteredDreams.length > 0) {
      const position = parseInt(scrollY, 10);
      if (!isNaN(position)) {
        console.log('Scroll pozisyonu geri yükleniyor:', position);
        setScrollOnMount(position);
        setHasRestoredScroll(true);
      }
    }
  }, [scrollY, hasRestoredScroll, isLoading, filteredDreams, setScrollOnMount]);

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
      // Geri dönülmüşse, otomatik scroll'u aktif et
      if (scrollY) {
        const position = parseInt(scrollY, 10);
        if (!isNaN(position)) {
          // Sayfa geriye döndüğünde son scroll pozisyonunu yükle
          console.log('useFocusEffect: scrollY parametresi bulundu:', position);
          lastScrollPosition.current = position;
        }
      } else {
        console.log('useFocusEffect: scrollY parametresi yok');
      }

      // Her ana sayfaya dönüşte resetle, böylece geri dönüş scroll'u hep çalışsın
      setHasRestoredScroll(false);
      loadDreams();

      // Geri dönüşte en son pozisyonu kullanmak için bir miktar gecikme ile scroll pozisyonunu ayarla
      setTimeout(() => {
        if (lastScrollPosition.current > 0) {
          console.log('useFocusEffect: scroll pozisyonu ayarlanmaya çalışılıyor:', lastScrollPosition.current);
          try {
            // @ts-ignore
            scrollViewRef.current?.scrollTo({ y: lastScrollPosition.current, animated: false });
          } catch (error) {
            console.error('Scroll hatası:', error);
          }
        }
      }, 1500);

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

  // Yeterli veri yoksa EmptyAnalytics göster
  if (!isLoading && (dreams.length === 0 || filteredDreams.length === 0)) {
    return (
      <>
        {/* Başlık ve geri tuşu */}
        <View style={styles.header}>
          <CustomBackButton />
          <Text style={styles.headerTitle}>Rüya Analizleri</Text>
          <View style={{width: 40}} />
        </View>
        <EmptyAnalytics onPress={navigateToDreamChat} />
      </>
    );
  }

// Bu sayfa için Stack Screen component'i ekleyelim ve header'ı gizleyelim
const { Stack } = require("expo-router");

  return (
    <>
      {/* Başlık ve geri tuşu */}
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>Rüya Analizleri</Text>
        <View style={{width: 40}} />
      </View>
      
      <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      // Scroll olaylarını optimize etmek için
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onContentSizeChange={() => {
        // İçerik boyutu değiştiğinde ve scroll pozisyonu geri yüklenmediyse
        if (lastScrollPosition.current > 0 && !hasRestoredScroll) {
          console.log('onContentSizeChange: Scroll pozisyonu ayarlanacak', lastScrollPosition.current);
          try {
            // @ts-ignore
            scrollViewRef.current?.scrollTo({ y: lastScrollPosition.current, animated: false });
            setHasRestoredScroll(true);
          } catch (error) {
            console.error('Scroll hatası:', error);
          }
        }
      }}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
          <Text style={styles.loadingText}>Analizler yükleniyor...</Text>
        </View>
      ) : (
        <>
          {/* Zaman Aralığı Filtresi */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filterLabel}>Zaman Aralığı:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
              <TouchableOpacity 
                style={[styles.timeRangeButton, timeRange === 7 && styles.selectedTimeRangeButton]} 
                onPress={() => handleTimeRangeChange(7)}
              >
                <MaterialCommunityIcons 
                  name="calendar-week" 
                  size={18} 
                  color={timeRange === 7 ? theme.colors.text : theme.colors.primary} 
                />
                <Text style={[styles.timeRangeButtonText, timeRange === 7 && styles.selectedTimeRangeText]}>
                  Son 7 Gün
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.timeRangeButton, timeRange === 30 && styles.selectedTimeRangeButton]} 
                onPress={() => handleTimeRangeChange(30)}
              >
                <MaterialCommunityIcons 
                  name="calendar-month" 
                  size={18} 
                  color={timeRange === 30 ? theme.colors.text : theme.colors.primary} 
                />
                <Text style={[styles.timeRangeButtonText, timeRange === 30 && styles.selectedTimeRangeText]}>
                  Son 30 Gün
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.timeRangeButton, timeRange === 90 && styles.selectedTimeRangeButton]} 
                onPress={() => handleTimeRangeChange(90)}
              >
                <MaterialCommunityIcons 
                  name="calendar-range" 
                  size={18} 
                  color={timeRange === 90 ? theme.colors.text : theme.colors.primary} 
                />
                <Text style={[styles.timeRangeButtonText, timeRange === 90 && styles.selectedTimeRangeText]}>
                  Son 90 Gün
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.timeRangeButton, timeRange === null && styles.selectedTimeRangeButton]} 
                onPress={() => handleTimeRangeChange(null)}
              >
                <MaterialCommunityIcons 
                  name="calendar" 
                  size={18} 
                  color={timeRange === null ? theme.colors.text : theme.colors.primary} 
                />
                <Text style={[styles.timeRangeButtonText, timeRange === null && styles.selectedTimeRangeText]}>
                  Tüm Zamanlar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Veri Sayısı Bilgisi */}
          {filteredDreams.length > 0 && (
            <View style={styles.dataInfoContainer}>
              <MaterialCommunityIcons name="information-outline" size={16} color={theme.colors.text} />
              <Text style={styles.dataInfoText}>
                Analiz {filteredDreams.length} rüya kaydına dayanmaktadır
                {timeRange && ` (Son ${timeRange} gün)`}
              </Text>
            </View>
          )}

          {/* Analiz Komponentleri */}
          {summary && Object.keys(summary).length > 0 && <AnalyticsSummary summary={summary} />}
          {emotions && emotions.length > 0 && <EmotionsChart emotions={emotions} onEmotionPress={handleEmotionFilter} />}
          {themes && themes.length > 0 && <ThemesChart themes={themes} onThemePress={handleThemeFilter} scrollViewRef={scrollViewRef} />}
          {archetypes && archetypes.length > 0 && <ArchetypesChart archetypes={archetypes} onArchetypePress={handleArchetypeFilter} scrollViewRef={scrollViewRef} />}
          {qualityData && qualityData.length > 0 && <DreamQualityChart qualityData={qualityData} />}
          {frequencyData && frequencyData.length > 0 && <DreamFrequencyChart frequencyData={frequencyData} />}
          {timePatterns && timePatterns.dayOfWeek && Object.keys(timePatterns.dayOfWeek).length > 0 && 
            <TimePatternChart timePatterns={timePatterns} />}
          {symbols && symbols.length > 0 && <SymbolsCloud symbols={symbols} scrollViewRef={scrollViewRef} />}
          
          {/* İçgörüler Promosyon Kartı */}
          {filteredDreams.length > 0 && <InsightPromotionCard dreamCount={dreams.length} />}
          {filteredDreams.length === 0 && !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Seçili zaman aralığında veri bulunamadı</Text>
              <TouchableOpacity 
                style={styles.emptyButton} 
                onPress={navigateToDreamChat}
              >
                <Text style={styles.emptyButtonText}>Yeni Rüya Ekle</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
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
    backgroundColor: 'rgba(241, 196, 15, 0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.3)',
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
