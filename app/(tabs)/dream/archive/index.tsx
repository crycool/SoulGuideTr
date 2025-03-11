import React, { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeleteDreamModal from '../_components/DeleteDreamModal';
import DeleteHintTooltip from '../_components/tooltip/DeleteHintTooltip';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import DreamArchiveList from '../_components/DreamArchiveList';
import DreamFilter from '../_components/DreamFilter';
import EmptyArchive from '../_components/EmptyArchive';
import { getDreams, deleteDream } from '../_services/dreamStorageService';
import { DreamRecord, DreamFilterOptions } from '../_utils/messageTypes';
import { applyFilters } from '../_utils/filterUtils';
import { theme } from '../../../theme';
import SuccessModal from '../_components/SuccessModal';

export default function DreamArchiveScreen() {
  const params = useLocalSearchParams<{ filter?: string, value?: string, symbolFilter?: string, scrollY?: string, fromAnalytics?: string }>();
  const [scrollPosition, setScrollPosition] = useState(0);
  // Son scroll pozisyonunu kaydeden ref
  const lastScrollPositionRef = useRef(0);
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<DreamRecord[]>([]);
  const [filterOptions, setFilterOptions] = useState<DreamFilterOptions>({
    sortBy: 'date',
    sortOrder: 'desc',
    symbol: params.symbolFilter, // URL parametresinden sembol filtresi al
    tag: params.filter === 'tag' ? params.value : undefined, // Arketip filtresi kontrolü
    emotions: params.filter === 'emotion' ? [params.value as string] : undefined, // Duygu filtresi kontrolü
    themes: params.filter === 'theme' ? [params.value as string] : undefined // Tema filtresi kontrolü
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [dreamToDelete, setDreamToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const tooltipShownKey = 'deleteTooltipShown';
  const [deletedDreamTitle, setDeletedDreamTitle] = useState('');
  const router = useRouter();
  const navigation = useNavigation();
  
  // useEffect(() => {
  //   // @ts-ignore - navigation.setOptions eksik tip bilgisi
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <ArchiveHeader onFilterPress={toggleFilter} onRefresh={loadDreams} />
  //     ),
  //   });
  // }, [navigation, toggleFilter, loadDreams]);

  // TEST İÇİN: Tooltip gösterimini zorlamak için kayıtlı durumu sil
  const resetTooltipState = async () => {
    try {
      await AsyncStorage.removeItem(tooltipShownKey);
      console.log("Tooltip durumu sıfırlandı, tekrar gösterilecek");
      setShowDeleteTooltip(true);
    } catch (error) {
      console.error('Tooltip durumu sıfırlanırken hata:', error);
    }
  };

  // Tooltip'in daha önce gösterilip gösterilmediğini kontrol et
  const checkTooltipShown = useCallback(async () => {
    try {
      const tooltipShown = await AsyncStorage.getItem(tooltipShownKey);
      console.log("Tooltip durumu kontrolü:", tooltipShown);
      
      if (tooltipShown !== 'true') {
        // Tooltip daha önce gösterilmemiş, gösterelim
        setShowDeleteTooltip(true);
        console.log("Tooltip gösterilecek, daha önce kaydedilmemiş");
      } else {
        // Kulllanıcı 'bir daha gösterme' dediği için gösterme
        setShowDeleteTooltip(false);
        console.log("Tooltip gösterilmeyecek, daha önce kaydedilmiş");
      }
    } catch (error) {
      console.error('Tooltip durumu kontrol edilirken hata:', error);
      // Hata durumunda yine de gösterelim
      setShowDeleteTooltip(true);
    }
  }, []);
  
  // Tooltip'i sadece gizle (geçici olarak kapat)
  const handleTooltipClose = useCallback(() => {
    setShowDeleteTooltip(false);
  }, []);
  
  // Tooltip'i kalıcı olarak kapat (bir daha gösterme)
  const handleNeverShowAgain = useCallback(async () => {
    setShowDeleteTooltip(false);
    
    try {
      await AsyncStorage.setItem(tooltipShownKey, 'true');
      console.log("Tooltip bir daha gösterilmeyecek şekilde ayarlandı - AsyncStorage'a kaydedildi");
    } catch (error) {
      console.error('Tooltip durumu kaydedilemedi:', error);
    }
  }, []);
  
  useEffect(() => {
    loadDreams();
    checkTooltipShown();
    
    // scrollY parametresi varsa, pozisyonu ayarla
    if (params.scrollY) {
      const position = parseInt(params.scrollY, 10);
      if (!isNaN(position)) {
        setScrollPosition(position);
      }
    }
    
    // TEST İÇİN: Tooltip durumunu sıfırla
    // resetTooltipState();
  }, [checkTooltipShown]);

  // URL'deki parametreler değiştiğinde filtre seçeneklerini güncelle
  useEffect(() => {
    // Sembol filtreleme parametresi
    if (params.symbolFilter) {
      setFilterOptions(prev => ({
        ...prev,
        symbol: params.symbolFilter
      }));
    }
    
    // Tag (Arketip) filtresi parametresi
    if (params.filter === 'tag' && params.value) {
      setFilterOptions(prev => ({
        ...prev,
        tag: params.value
      }));
    }

    // Duygu filtresi parametresi
    if (params.filter === 'emotion' && params.value) {
      setFilterOptions(prev => ({
        ...prev,
        emotions: [params.value as string]
      }));
    }
    
    // Tema filtresi parametresi
    if (params.filter === 'theme' && params.value) {
      setFilterOptions(prev => ({
        ...prev,
        themes: [params.value as string]
      }));
    }
  }, [params.symbolFilter, params.filter, params.value]);

  useEffect(() => {
    const filtered = applyFilters(dreams, filterOptions);
    setFilteredDreams(filtered);
  }, [dreams, filterOptions]);

  const loadDreams = async () => {
    setIsLoading(true);
    try {
      const storedDreams = await getDreams();
      setDreams(storedDreams);
    } catch (error) {
      console.error('Error loading dreams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newOptions: Partial<DreamFilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newOptions }));
  };

  const handleDreamPress = (dreamId: string) => {
    // Şu anki scroll pozisyonunu kaydet
    lastScrollPositionRef.current = scrollPosition;
    console.log('Arşiv detaya giderken scroll pozisyonu kaydedildi:', lastScrollPositionRef.current);

    // Mevcut filtreleme parametrelerini kullanarak detay sayfasına yönlendir
    const navigationParams: Record<string, string> = { dreamId };
    
    // Aktif filtreler varsa, bunları params'a ekle
    if (filterOptions.tag) {
      navigationParams.filter = 'tag';
      navigationParams.value = filterOptions.tag;
    } else if (filterOptions.emotions && filterOptions.emotions.length > 0) {
      navigationParams.filter = 'emotion';
      navigationParams.value = filterOptions.emotions[0];
    } else if (filterOptions.themes && filterOptions.themes.length > 0) {
      navigationParams.filter = 'theme';
      navigationParams.value = filterOptions.themes[0];
    } else if (filterOptions.symbol) {
      navigationParams.symbolFilter = filterOptions.symbol;
    }

    // Analiz sayfasından geldiğini belirten flag varsa onu da ekle
    if (params.fromAnalytics) {
      navigationParams.fromAnalytics = 'true';
    }
    
    router.push({
      pathname: '/(tabs)/dream/archive/details',
      params: navigationParams
    });
  };

  const initiateDelete = (dreamId: string) => {
    // Bu rüyayı bul
    const dream = dreams.find(d => d.id === dreamId);
    if (!dream) return;
    
    // Rüya özetini al (ilk 30 karakter)
    const dreamSummary = dream.dreamContent.length > 30
      ? `${dream.dreamContent.substring(0, 30)}...`
      : dream.dreamContent;
    
    setDreamToDelete(dreamId);
    setDeletedDreamTitle(dreamSummary);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!dreamToDelete) return;
    
    try {
      await deleteDream(dreamToDelete);
      setShowDeleteModal(false);
      
      // Başarı mesajını göster
      setShowSuccessModal(true);
      
      // Listeyi yenile
      loadDreams();
    } catch (error) {
      console.error('Error deleting dream:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDreamToDelete(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const toggleFilter = () => {
    console.log('Toggle filter clicked, current state:', showFilter);
    setShowFilter(!showFilter);
    console.log('New showFilter state:', !showFilter);
  };

  const clearSymbolFilter = () => {
    // Scroll pozisyonunu koruyarak filtreyi temizle
    router.replace({
      pathname: '/(tabs)/dream/archive',
      params: { scrollY: scrollPosition.toString() }
    });
    setFilterOptions(prev => ({
      ...prev,
      symbol: undefined
    }));
  };

  return (
    <>
      {showDeleteTooltip && (
        <DeleteHintTooltip 
          onClose={handleTooltipClose}
          onNeverShowAgain={handleNeverShowAgain} 
        />
      )}
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Rüya Arşivi</Text>
          
          <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
            <Feather name="filter" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Filtreleme modalı */}
        <DreamFilter
          visible={showFilter}
          options={filterOptions}
          onChange={handleFilterChange}
          onClose={() => setShowFilter(false)}
        />
      
        {params.filter === 'tag' && params.value && (
          <View style={styles.activeFilterBanner}>
            <Text style={styles.activeFilterText}>
              <Feather name="filter" size={14} color="#fff" /> 
              Arketip Filtresi: {params.value}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                // Scroll pozisyonunu koruyarak filtreyi temizle
                router.replace({
                  pathname: '/(tabs)/dream/archive',
                  params: { scrollY: scrollPosition.toString() }
                });
                setFilterOptions(prev => ({ ...prev, tag: undefined }));
              }}
              style={styles.clearFilterButton}
            >
              <Text style={styles.clearFilterText}>Temizle</Text>
            </TouchableOpacity>
          </View>
        )}

        {params.filter === 'emotion' && params.value && (
          <View style={[styles.activeFilterBanner, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.activeFilterText}>
              <Feather name="heart" size={14} color="#fff" /> 
              Duygu Filtresi: {params.value}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                // Scroll pozisyonunu koruyarak filtreyi temizle
                router.replace({
                  pathname: '/(tabs)/dream/archive',
                  params: { scrollY: scrollPosition.toString() }
                });
                setFilterOptions(prev => ({ ...prev, emotions: undefined }));
              }}
              style={styles.clearFilterButton}
            >
              <Text style={styles.clearFilterText}>Temizle</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {params.filter === 'theme' && params.value && (
          <View style={[styles.activeFilterBanner, { backgroundColor: '#4285F4' }]}>
            <Text style={styles.activeFilterText}>
              <Feather name="star" size={14} color="#fff" /> 
              Tema Filtresi: {params.value}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                // Scroll pozisyonunu koruyarak filtreyi temizle
                router.replace({
                  pathname: '/(tabs)/dream/archive',
                  params: { scrollY: scrollPosition.toString() }
                });
                setFilterOptions(prev => ({ ...prev, themes: undefined }));
              }}
              style={styles.clearFilterButton}
            >
              <Text style={styles.clearFilterText}>Temizle</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {params.symbolFilter && !params.filter && (
          <View style={styles.activeFilterBanner}>
            <Text style={styles.activeFilterText}>
              <Feather name="filter" size={14} color="#fff" /> 
              Sembol Filtresi: {params.symbolFilter}
            </Text>
            <TouchableOpacity 
              onPress={clearSymbolFilter}
              style={styles.clearFilterButton}
            >
              <Text style={styles.clearFilterText}>Temizle</Text>
            </TouchableOpacity>
          </View>
        )}
      
        {filteredDreams.length > 0 ? (
          <DreamArchiveList
            dreams={filteredDreams}
            onDreamPress={handleDreamPress}
            onDreamDelete={initiateDelete}
            isLoading={isLoading}
          />
        ) : (
          <EmptyArchive isLoading={isLoading} />
        )}
    </SafeAreaView>
      
      <DeleteDreamModal
        visible={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        dreamTitle={deletedDreamTitle}
      />
      
      <SuccessModal
        visible={showSuccessModal}
        onClose={closeSuccessModal}
        title="Rüya Silindi"
        message="Rüyanız başarıyla silindi."
        autoClose={true}
        autoCloseTime={2000}
      />

      {/* TEST İÇİN: Tooltip sıfırlama butonu */}
      {/* <TouchableOpacity 
        style={{
          position: 'absolute', 
          bottom: 100, 
          right: 20, 
          backgroundColor: 'rgba(142, 68, 173, 0.9)',
          padding: 10,
          borderRadius: 10,
          zIndex: 9999
        }}
        onPress={resetTooltipState}
      >
        <Text style={{color: 'white'}}>Tooltip Sıfırla</Text>
      </TouchableOpacity> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  filterButton: {
    padding: theme.spacing.xs,
  },
  activeFilterBanner: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeFilterText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  clearFilterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  clearFilterText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
  }
});