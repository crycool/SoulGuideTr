import React, { useState, useEffect } from 'react';

// Sabit bir scroll pozisyonu değeri 
// Gelecekte bu uygulama için daha gelişmiş bir çözüm kullanılabilir
const ANALYTICS_SCROLL_POSITION = 800; // Arketip bölümünün yaklaşık y konumu
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import DreamDetail from '../_components/DreamDetail';
import { getDreamById } from '../_services/dreamStorageService';
import { DreamRecord } from '../_utils/messageTypes';
import { theme } from '../../../theme';

export default function DreamDetailScreen() {
  const { dreamId, filter, value, symbolFilter, fromAnalytics } = useLocalSearchParams<{ dreamId: string, filter?: string, value?: string, symbolFilter?: string, fromAnalytics?: string }>();
  const [dream, setDream] = useState<DreamRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  
  // Başlığı ayarla
  // useEffect(() => {
  //   // @ts-ignore - navigation.setOptions eksik tip bilgisi
  //   navigation.setOptions({
  //     title: 'Rüya Detayı'
  //   });
  // }, [navigation]);

  useEffect(() => {
    if (dreamId) {
      loadDream(dreamId);
    }
  }, [dreamId]);

  const loadDream = async (id: string) => {
    setIsLoading(true);
    try {
      const dreamData = await getDreamById(id);
      setDream(dreamData);
    } catch (error) {
      console.error('Error loading dream details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => {
          // fromAnalytics parametresi varsa, analizlere dön
          if (fromAnalytics === 'true') {
            // Analizlere direkt dön, scroll pozisyonunu da gönder
            router.push({
              pathname: '/(tabs)/dream/analytics',
              params: {
                scrollY: ANALYTICS_SCROLL_POSITION.toString()
              }
            });
          } else {
            // Normal back davranışı - filtrelenmiş listeye dön
            router.back();
          }
        }} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Rüya Detayı</Text>
        
        <View style={styles.placeholder} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : dream ? (
        <ScrollView style={styles.scrollContainer}>
          <DreamDetail dream={dream} />
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Rüya bulunamadı</Text>
        </View>
      )}
    </View>
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
  placeholder: {
    width: 24, // Geri butonu ile dengelemek için
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'center',
  }
});