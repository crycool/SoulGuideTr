import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

// Bileşenler
import InsightCard, { insightGradients, insightIcons } from './_components/InsightCard';
import InsightHeader from './_components/InsightHeader';
import InsightDetails from './_components/InsightDetails';
import InsightProgress from './_components/InsightProgress';
import InsightInfoPopup from './_components/InsightInfoPopup';
import InsightSkeleton from './_components/InsightSkeleton';
import LockedInsight from './_components/LockedInsight';
import CustomBackButton from '../_components/CustomBackButton';

// Servisler ve Yardımcılar
import { loadInsights, refreshInsights, areInsightsUpToDate } from './_services/insightStorage';
import { theme } from '../../../theme';
import { insightHelpers } from '../_utils/insightQuotes';

/**
 * Rüya İçgörüleri Sayfası
 * Kullanıcının rüya verilerinden elde edilen derin psikolojik içgörüleri gösterir
 */
export default function InsightsScreen() {
  const router = useRouter();
  // State'ler
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false); // Biliçaltı işlemesi
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  
  // Alıntı için state - içgörü sayfası yüklenirken ve yenilenirken rastgele alıntı gösterir
  const [currentQuote, setCurrentQuote] = useState(insightHelpers.getUniqueRandomQuote());
  
  // İçgörüleri yükle
  const loadInsightData = async () => {
    try {
      setLoading(true);
      
      // Önce yerel depolamadan yükle
      const storedInsights = await loadInsights();
      setInsights(storedInsights);
      
      // Eğer içgörüler güncel değilse ve yeterli rüya varsa güncelle
      const isUpToDate = await areInsightsUpToDate();
      if (!isUpToDate && storedInsights && storedInsights.dreamCount >= 3) {
        const freshInsights = await refreshInsights();
        setInsights(freshInsights);
      }
      
      // Biliçaltı işlemesi simülasyonu
      // Kullanıcıya biliçaltının hala rüyaları işlediği hissini vermek için
      if (storedInsights && storedInsights.dreamCount >= 2) {
        // Rastgele bir süre içinde işleme durumunu etkinleştir
        setTimeout(() => {
          setProcessing(true);
          
          // 3-8 saniye arası rastgele bir süre içinde işlemeyi tamamla
          const processingTime = Math.random() * 5000 + 3000;
          setTimeout(() => {
            setProcessing(false);
          }, processingTime);
        }, Math.random() * 10000 + 5000); // 5-15 saniye arası başlangıç gecikmesi
      }
    } catch (error) {
      console.error('İçgörü yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Sayfa odaklandığında içgörüleri yükle
  useFocusEffect(
    useCallback(() => {
      loadInsightData();
    }, [])
  );
  
  // Pull-to-refresh - Zorla yenileme
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      // Alıntıyı yenile
      setCurrentQuote(insightHelpers.getUniqueRandomQuote());
      
      // forceRefresh parametresi ile yenileme yap
      const freshInsights = await refreshInsights(true);
      setInsights(freshInsights);
      
      // Pattern ve öneri boş mu kontrol et
      const isPatternEmpty = freshInsights.pattern === "Henüz belirgin bir örüntü tespit edilemedi." ||
                             freshInsights.pattern === "Rüyalarınızda belirgin örüntüler tespit etmek için sistem analizleri yenilendi, lütfen daha sonra tekrar kontrol edin.";
                             
      const isSuggestionEmpty = freshInsights.suggestion === "Daha fazla rüya kaydetmeye devam edin.";
      
      // Bilgi mesajı göstererek kullanıcıyı bilgilendir
      if (isPatternEmpty || isSuggestionEmpty) {
        // Burada bir Toast mesajı gösterilebilir (dış bir kütüphane gerekebilir)
        console.log('Bazı içgörüler henüz oluşturulamamıştır. Daha fazla rüya kaydederek veya daha detaylı rüyalar girerek içgörülerin kalitesini artırabilirsiniz.');
      }
      
    } catch (error) {
      console.error('İçgörü yenileme hatası:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Bir sonraki kilometre taşını hesapla
  const calculateNextMilestone = (dreamCount: number) => {
    return Math.ceil(dreamCount / 5) * 5 + 5;
  };
  
  // İçgörü detaylarını göster
  const showInsightDetail = (insight: any) => {
    setSelectedInsight(insight);
  };
  
  // İçgörü detaylarını kapat
  const closeInsightDetail = () => {
    setSelectedInsight(null);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Stack.Screen kaldırıldı, _layout.tsx'te zaten headerShown: false */}
      
      {/* Arkaplan Öğeleri */}
      <LinearGradient
        colors={[
          'rgba(18, 18, 32, 0.97)', 
          'rgba(30, 30, 45, 0.95)', 
          'rgba(18, 18, 32, 0.97)'
        ]}
        style={{flex: 1}}
      >
        {/* Kozmik Parçacıklar */}
        <View style={styles.particles}>
          {Array.from({ length: 20 }).map((_, index) => (
            <Animatable.View 
              key={index}
              animation="pulse"
              iterationCount="infinite"
              duration={2000 + (index * 200)}
              delay={index * 100}
              style={[
                styles.particle,
                {
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  opacity: Math.random() * 0.5 + 0.1,
                }
              ]}
            />
          ))}
        </View>
        
        {/* Header */}
        <View style={styles.header}>
          <CustomBackButton />
          <Text style={styles.headerTitle}>Rüya İçgörüleri</Text>
          <View style={{width: 40}} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.background}
            />
          }
        >
          {loading ? (
            // Yükleniyor durumu
            <View style={styles.loadingContainer}>
              <InsightSkeleton type="header" />
              <InsightSkeleton type="card" count={3} />
            </View>
          ) : insights ? (
            // İçgörüler
            <>
              {/* Ana İçgörü Başlığı */}
              <InsightHeader 
                title={insights.mainInsight}
                dreamCount={insights.dreamCount}
                onRefresh={onRefresh}
                isLoading={refreshing}
              />
              
              {/* Bilinçaltı İşleme Bildirimi - Toast Stili */}
              {processing && (
                <Animatable.View
                  animation="fadeIn"
                  duration={600}
                  style={styles.processingToast}
                >
                  <LinearGradient
                    colors={['rgba(155, 89, 182, 0.8)', 'rgba(142, 68, 173, 0.8)', 'rgba(125, 60, 152, 0.8)']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.processingGradient}
                  >
                    <Animatable.View 
                      animation="pulse"
                      iterationCount="infinite"
                      duration={1500}
                      style={styles.processingIconContainer}
                    >
                      <Ionicons name="brain" size={20} color="#fff" />
                    </Animatable.View>
                    
                    <View style={styles.processingContent}>
                      <Text style={styles.processingTitle}>Bilinçaltınız Çalışıyor</Text>
                      <Text style={styles.processingText}>Rüya verileriniz işleniyor...</Text>
                    </View>
                  </LinearGradient>
                </Animatable.View>
              )}
              
              {/* İlerleme Durumu */}
              <InsightProgress 
                dreamCount={insights.dreamCount} 
                nextMilestone={calculateNextMilestone(insights.dreamCount)} 
              />
              
              {/* Alt İçgörüler */}
              {insights.subInsights && insights.subInsights.length > 0 && (
                <View style={styles.subInsightsSection}>
                  <Text style={styles.sectionTitle}>Kişisel İçgörüler</Text>
                  
                  {insights.subInsights.map((insight: any, index: number) => (
                    <InsightCard
                      key={index}
                      title={insight.title}
                      content={insight.content}
                      onPress={() => showInsightDetail(insight)}
                      index={index}
                      iconName={insightIcons[index % insightIcons.length]}
                      gradientColors={insightGradients[index % insightGradients.length]}
                    />
                  ))}
                  
                  {/* Kilitli İçgörü */}
                  {insights.dreamCount < 10 && (
                    <Animatable.View
                      animation="pulse"
                      iterationCount={3}
                      duration={1500}
                    >
                      <LockedInsight
                        title="Derin Bilinçaltı Örüntüleri"
                        requiredDreams={10}
                        currentDreams={insights.dreamCount}
                        onPress={() => router.push('/(tabs)/dream/chat')}
                      />
                    </Animatable.View>
                  )}
                </View>
              )}
              
              {/* Bilinçaltı Örüntüsü */}
              {insights.pattern && (
                <View style={styles.patternSection}>
                  <Text style={styles.sectionTitle}>Bilinçaltı Örüntünüz</Text>
                  
                  <Animatable.View
                    animation="fadeIn"
                    delay={1000}
                    duration={800}
                  >
                    <TouchableOpacity
                      style={styles.patternCard}
                      onPress={() => showInsightDetail({
                        title: "Bilinçaltı Örüntünüz",
                        content: insights.pattern,
                        sourceType: "pattern"
                      })}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['rgba(155, 89, 182, 0.3)', 'rgba(155, 89, 182, 0.1)']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.patternGradient}
                      >
                        <View style={styles.patternIcon}>
                          <Ionicons name="git-network" size={24} color={theme.colors.secondary} />
                        </View>
                        
                        <Text style={styles.patternText}>
                          {insights.pattern.length > 120 
                            ? insights.pattern.substring(0, 120) + '...' 
                            : insights.pattern}
                        </Text>
                        
                        <View style={styles.readMoreContainer}>
                          <Text style={styles.readMoreText}>Detayları Gör</Text>
                          <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>
              )}
              
              {/* Gelişim Önerisi */}
              {insights.suggestion && (
                <View style={styles.suggestionSection}>
                  <Text style={styles.sectionTitle}>Gelişim Önerisi</Text>
                  
                  <Animatable.View
                    animation="fadeIn"
                    delay={1200}
                    duration={800}
                  >
                    <TouchableOpacity
                      style={styles.suggestionCard}
                      onPress={() => showInsightDetail({
                        title: "Gelişim Öneriniz",
                        content: insights.suggestion,
                        sourceType: "suggestion",
                        additionalInfo: "Bu öneri, rüyalarınızdaki duygusal ve sembolik örüntülere dayanarak oluşturulmuştur. Bilinçaltınızın mesajlarını günlük hayatınıza entegre etmenize yardımcı olabilir."
                      })}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['rgba(46, 204, 113, 0.3)', 'rgba(46, 204, 113, 0.1)']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.suggestionGradient}
                      >
                        <View style={styles.suggestionHeader}>
                          <View style={styles.suggestionIcon}>
                            <Ionicons name="leaf" size={24} color={theme.colors.success} />
                          </View>
                          
                          <Text style={styles.suggestionTitle}>Kişisel Gelişim İçin</Text>
                        </View>
                        
                        <Text style={styles.suggestionText}>
                          {insights.suggestion}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>
              )}
              
              {/* Sonraki Adımlar */}
              {insights.nextFocus && insights.nextFocus.length > 0 && (
                <View style={styles.nextFocusSection}>
                  <Text style={styles.sectionTitle}>Sonraki Rüyalarınızda</Text>
                  
                  <Animatable.View
                    animation="fadeIn"
                    delay={1400}
                    duration={800}
                  >
                    <LinearGradient
                      colors={['rgba(31, 31, 48, 0.95)', 'rgba(31, 31, 48, 0.85)']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.nextFocusCard}
                    >
                      <Text style={styles.nextFocusIntro}>
                        Bu unsurlara dikkat ederek bilinçaltınıza dair daha fazla içgörü kazanabilirsiniz:
                      </Text>
                      
                      {insights.nextFocus.map((focus: string, index: number) => (
                        <View key={index} style={styles.focusItem}>
                          <View style={styles.focusBullet}>
                            <Text style={styles.focusBulletText}>{index + 1}</Text>
                          </View>
                          <Text style={styles.focusText}>{focus}</Text>
                        </View>
                      ))}
                      
                      <TouchableOpacity 
                        style={styles.dreamButton}
                        onPress={() => router.push('/(tabs)/dream/chat')}
                      >
                        <Ionicons name="add-circle" size={16} color={theme.colors.text} />
                        <Text style={styles.dreamButtonText}>Yeni Rüya Kaydet</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </Animatable.View>
                </View>
              )}
              
              {/* Jung Alıntısı */}
              <Animatable.View
                animation="fadeIn"
                delay={1600}
                duration={800}
                style={styles.quoteContainer}
              >
                <Text style={styles.quoteText}>
                  {currentQuote.text}
                </Text>
                <Text style={styles.quoteAuthor}>- {currentQuote.author}</Text>
              </Animatable.View>
            </>
          ) : (
            // İçgörü Bulunamadı
            <View style={styles.notFoundContainer}>
              <Animatable.View
                animation="fadeIn"
                duration={1000}
                style={styles.notFoundIcon}
              >
                <Ionicons name="moon-outline" size={64} color={theme.colors.textSecondary} />
              </Animatable.View>
              
              <Text style={styles.notFoundTitle}>Henüz İçgörü Yok</Text>
              <Text style={styles.notFoundText}>
                İçgörüler oluşturmak için lütfen birkaç rüya kaydedin. Her rüya, bilinçaltınıza açılan bir kapıdır.
              </Text>
              
              <TouchableOpacity 
                style={styles.newDreamButton}
                onPress={() => router.push('/(tabs)/dream/chat')}
              >
                <LinearGradient
                  colors={['#9b59b6', '#8e44ad']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.newDreamGradient}
                >
                  <Ionicons name="add-circle" size={18} color={theme.colors.text} />
                  <Text style={styles.newDreamText}>İlk Rüyanı Kaydet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        
        {/* İçgörü Detayları Modal */}
        {selectedInsight && (
          <InsightDetails
            title={selectedInsight.title}
            content={selectedInsight.content}
            onClose={closeInsightDetail}
            sourceType={selectedInsight.sourceType}
            additionalInfo={selectedInsight.additionalInfo}
          />
        )}
        
        {/* İçgörü Bilgilendirme Popup'ı */}
        <InsightInfoPopup />
      </LinearGradient>
    </SafeAreaView>
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
    zIndex: 10,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 3,
  },
  loadingContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subInsightsSection: {
    marginBottom: theme.spacing.xl,
  },
  patternSection: {
    marginBottom: theme.spacing.xl,
  },
  patternCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  patternGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  patternIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  patternText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  readMoreText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  suggestionSection: {
    marginBottom: theme.spacing.xl,
  },
  suggestionCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  suggestionGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  suggestionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
  },
  suggestionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  nextFocusSection: {
    marginBottom: theme.spacing.xl,
  },
  nextFocusCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...theme.shadows.md,
  },
  nextFocusIntro: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(31, 31, 48, 0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  focusBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  focusBulletText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
  },
  focusText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  dreamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  dreamButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  quoteContainer: {
    backgroundColor: 'rgba(247, 203, 47, 0.1)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  quoteText: {
    fontSize: theme.typography.fontSize.md,
    fontStyle: 'italic',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    textAlign: 'right',
  },
  notFoundContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  notFoundIcon: {
    marginBottom: theme.spacing.lg,
  },
  notFoundTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  notFoundText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  newDreamButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  newDreamGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  newDreamText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  // Yeni Toast Bildirimi Stilleri
  processingToast: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  processingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  processingIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  processingContent: {
    flex: 1,
  },
  processingTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#ffffff',
    marginBottom: 2,
  },
  processingText: {
    fontSize: theme.typography.fontSize.xs,
    color: '#ffffff',
    opacity: 0.9,
  },
});
