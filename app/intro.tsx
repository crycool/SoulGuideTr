import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from './theme';

const { width, height } = Dimensions.get('window');

// Toplam yıldız sayısı
const TOTAL_STARS = 50;
// Animasyon süresi (ms)
const ANIMATION_DURATION = 10000;
// Azaltma aralığı (ms)
const REDUCTION_INTERVAL = 1000;

export default function IntroScreen() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const animationRefs = useRef([]);
  const [visibleStarCount, setVisibleStarCount] = useState(TOTAL_STARS);
  const timerRef = useRef(null);

  // Alttaki büyük sarı baloncuk için özel pozisyon
  const getBottomBubblePosition = () => {
    // Eğer ekran genişliği 380'den küçükse, baloncuk daha fazla sağa kaydırılsın
    if (width < 380) {
      return { right: -120 };
    }
    // Varsayılan pozisyon
    return { right: -70 };
  };
  
  // Alttaki baloncuk için pozisyon hesapla
  const bottomBubblePosition = getBottomBubblePosition();

  // Sayfa geçişi için optimize edilmiş fonksiyon
  const navigateToDream = useCallback(() => {
    // Önce animasyonları durdur
    animationRefs.current.forEach(anim => {
      if (anim && anim.stopAnimation) {
        anim.stopAnimation();
      }
    });

    // Zamanlayıcıyı temizle
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Küçük bir gecikme ile yönlendirme yap
    setTimeout(() => {
      router.push('/dream');
    }, 50);
  }, [router]);

  // Tüm yıldızları useMemo ile bir kere oluştur
  const stars = useMemo(() => {
    return Array.from({ length: TOTAL_STARS }).map((_, index) => ({
      id: index,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.25,
      duration: Math.random() * 3000 + 2000,
      delay: Math.random() * 1000,
    }));
  }, []);

  // Animasyon referansını kaydetme fonksiyonu
  const handleAnimationRef = useCallback((ref, index) => {
    if (ref) {
      animationRefs.current[index] = ref;
    }
  }, []);

  // 10 saniye içinde yıldızları azaltma efekti
  useEffect(() => {
    const starsPerInterval = Math.ceil(TOTAL_STARS / (ANIMATION_DURATION / REDUCTION_INTERVAL));
    
    timerRef.current = setInterval(() => {
      setVisibleStarCount(prev => {
        const newCount = Math.max(0, prev - starsPerInterval);
        if (newCount <= 0) {
          clearInterval(timerRef.current);
        }
        return newCount;
      });
    }, REDUCTION_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Tüm animasyonları temizle
      animationRefs.current.forEach(anim => {
        if (anim && anim.stopAnimation) {
          anim.stopAnimation();
        }
      });
    };
  }, []);

  // Tanıtım içeriği
  const introContent = [
    {
      id: 'intro',
      title: 'Rüyaların Dili',
      content: 'Rüyalarınız sadece birer hayal değil, bilinçaltınızın size gönderdiği mesajlardır. SoulGuide ile bu mesajları artık anlayabileceksiniz.',
      icon: <Ionicons name="moon" size={42} color="#fff" />,
      color: '#9b59b6',
      delay: 300
    },
    {
      id: 'rise',
      title: 'Keşif Başlıyor',
      content: 'Her rüyanızı kaydedin, anında Jung psikolojisi perspektifinden yorumlar alın. Duygular, semboller ve arketipler analiz edilirken, bilinçaltınız haritalanmaya başlar.',
      icon: <Ionicons name="analytics" size={42} color="#fff" />,
      color: '#3498db',
      delay: 400
    },
    {
      id: 'climax',
      title: 'İçgörülerin Gücü',
      content: 'SoulGuide\'in gerçek sihri içgörülerde saklı. Yapay zeka, rüyalarınız arasındaki bağlantıları keşfederek sadece size özel içgörüler üretir. Tekrarlayan semboller, duygusal örüntüler ve arketipler arasındaki ilişkiler, bilinçaltınızın derinliklerinde saklı gerçekleri ortaya çıkarır.',
      icon: <Ionicons name="bulb" size={42} color="#fff" />,
      color: '#e74c3c',
      delay: 500
    },
    {
      id: 'resolution',
      title: 'Bilinçaltı Haritanız',
      content: 'Her yeni rüya, bilinçaltı haritanızı zenginleştirir. Grafikler ve görsellerle desteklenen analizler, size iç dünyanızı daha önce hiç görmediğiniz şekilde sunacak. Kaydedilen her rüya, bilinçaltınızın kilitlediği bir kapıyı daha açar.',
      icon: <Ionicons name="key" size={42} color="#fff" />,
      color: '#f1c40f',
      delay: 600
    },
    {
      id: 'end',
      title: 'Dönüşüm Yolculuğu',
      content: 'SoulGuide sadece bir rüya günlüğü değil, bilinçaltınızın rehberidir. Kendinizi keşfedin, anlayın ve dönüştürün. Çünkü en büyük keşif yolculuğu, kendi içinize yaptığınızdır.',
      icon: <Ionicons name="compass" size={42} color="#fff" />,
      color: '#2ecc71',
      delay: 700
    }
  ];

  // Features array
  const appFeatures = [
    { 
      icon: <Ionicons name="moon" size={24} color="#fff" />, 
      text: "Rüya Yorumlama", 
      description: "Rüyalarınızı anında Jung psikolojisi perspektifinden yorumlayın.",
      color: "#9b59b6",
      delay: 600 
    },
    { 
      icon: <Ionicons name="bulb" size={24} color="#fff" />, 
      text: "Bilinçaltı İçgörüleri", 
      description: "Tekrarlayan semboller ve duygusal örüntüler arasındaki ilişkileri keşfedin.",
      color: "#3498db",
      delay: 700 
    },
    { 
      icon: <Ionicons name="analytics" size={24} color="#fff" />, 
      text: "Detaylı Analizler", 
      description: "Grafiklerle bilinçaltı haritanızı görün, istatistiklerle iç dünyanızı anlayın.",
      color: "#e74c3c",
      delay: 800 
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <Stack.Screen 
        options={{
          title: 'SoulGuide',
          headerShown: false
        }} 
      />
      
      {/* Arkaplan elemetleri */}
      <View style={styles.backgroundElements}>
        {/* Yıldızlar - sadece görünür sayıda göster */}
        {stars.slice(0, visibleStarCount).map((star, index) => (
          <Animatable.View
            key={star.id}
            ref={(ref) => handleAnimationRef(ref, index)}
            animation="pulse"
            easing="ease-in-out"
            iterationCount={3} // Sonsuz yerine 3 kez
            duration={star.duration}
            delay={star.delay}
            style={[
              styles.star,
              {
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }
            ]}
          />
        ))}
        
        {/* Arkaplan formları */}
        <Animatable.View 
          animation="fadeIn" 
          duration={2000}
          iterationCount={1}
          ref={(ref) => handleAnimationRef(ref, TOTAL_STARS)}
          style={[styles.bgForm, { 
            top: height * 0.15, 
            left: -50, 
            width: 200, 
            height: 200, 
            opacity: 0.01, // Daha da düşük opacity
            transform: [{ rotate: '25deg' }] 
          }]} 
        />
        <Animatable.View 
          animation="fadeIn" 
          duration={2000}
          iterationCount={1}
          ref={(ref) => handleAnimationRef(ref, TOTAL_STARS + 1)}
          style={[styles.bgForm, { 
            top: height * 0.65, // Daha altta konumlandırma
            ...bottomBubblePosition, // Dinamik pozisyon
            width: 250, 
            height: 250, 
            opacity: 0.008, // Daha da düşük opacity
            transform: [{ rotate: '-15deg' }] 
          }]} 
        />
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tanıtım Başlığı */}
        <Animatable.View 
          animation="fadeIn"
          duration={1000}
          iterationCount={1}
          ref={(ref) => handleAnimationRef(ref, TOTAL_STARS + 2)}
          style={styles.headerSection}
        >
          <Animatable.View 
            animation="pulse"
            iterationCount={3}
            duration={4000}
            easing="ease-in-out"
            ref={(ref) => handleAnimationRef(ref, TOTAL_STARS + 3)}
            style={styles.logoContainer}
          >
            <LinearGradient
              colors={['rgba(247, 203, 47, 0.2)', 'rgba(247, 203, 47, 0.0)']}
              style={styles.logoGlow}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>✨</Text>
            </View>
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeIn" 
            delay={300}
            iterationCount={1}
            style={styles.titleContainer}
          >
            <Text style={styles.mainTitle}>SoulGuide</Text>
            <Text style={styles.subtitle}>Bilinçaltınızın Keşif Yolculuğu</Text>
          </Animatable.View>
        </Animatable.View>

        {/* Tanıtım Adımları */}
        {introContent.map((step, index) => (
          <Animatable.View
            key={step.id}
            animation="fadeInUp"
            delay={step.delay}
            duration={800}
            iterationCount={1}
            style={styles.stepContainer}
          >
            <LinearGradient
              colors={[`${step.color}20`, `${step.color}05`]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={[styles.stepCard, { borderColor: `${step.color}40` }]}
            >
              <View style={styles.stepHeader}>
                <View style={[styles.stepIconContainer, { backgroundColor: step.color }]}>
                  {step.icon}
                </View>
                <Text style={[styles.stepTitle, { color: step.color }]}>{step.title}</Text>
              </View>
              <Text style={styles.stepContent}>{step.content}</Text>
              
              {index === 2 && ( // İçgörüler bölümünde özel vurgu
                <Animatable.View 
                  animation="pulse" 
                  iterationCount={3}
                  duration={2000}
                  style={styles.highlightBanner}
                >
                  <Text style={styles.highlightText}>SoulGuide'ın gerçek sihri içgörülerde!</Text>
                </Animatable.View>
              )}
            </LinearGradient>
          </Animatable.View>
        ))}
        
        {/* Özellikler */}
        <Animatable.View
          animation="fadeIn"
          delay={800}
          duration={800}
          style={styles.featuresSection}
        >
          <Text style={styles.sectionTitle}>Sizi Neler Bekliyor?</Text>
          
          <View style={styles.featuresGrid}>
            {appFeatures.map((feature, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={feature.delay}
                duration={600}
                style={styles.featureCard}
              >
                <LinearGradient
                  colors={[`${feature.color}20`, `${feature.color}10`]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={[styles.featureCardGradient, { borderColor: `${feature.color}30` }]}
                >
                  <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                    {feature.icon}
                  </View>
                  <Text style={styles.featureTitle}>{feature.text}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </LinearGradient>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        {/* Başlama Butonu */}
        <Animatable.View
          animation="fadeIn"
          delay={1000}
          duration={800}
          style={styles.ctaSection}
        >
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={navigateToDream}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#a55ebd', '#9b59b6']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>Bilinçaltı Yolculuğuna Başla</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.finalQuote}>
            <Text style={styles.finalQuoteText}>
              "Çünkü en büyük keşif yolculuğu, kendi içinize yaptığınızdır."
            </Text>
          </Text>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 1, // Arka planda kalması için düşük z-index değeri
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
  bgForm: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    zIndex: 1, // Metin elementlerinin altında kalması için düşük değer
  },
  scrollView: {
    flex: 1,
    zIndex: 2, // İçerik baloncukların üzerinde gösterilsin
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: 100,
    position: 'relative', // Konumlandırma için gerekli
    zIndex: 5, // Yüksek z-index değeri ile içeriğin üst katmanda olmasını sağlıyoruz
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    height: 130,
  },
  logoGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    top: 0,
    left: 0,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1f1f30',
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 40,
    color: theme.colors.primary,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  mainTitle: {
    fontSize: theme.typography.fontSize.xxl + 10,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    paddingLeft: theme.spacing.xs,
  },
  stepContainer: {
    marginBottom: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  stepCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    backgroundColor: 'rgba(31, 31, 48, 0.7)', // Hafif opak arka plan rengi ekleme
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stepIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  stepContent: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  highlightBanner: {
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  highlightText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: theme.spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
  featureCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  featureCardGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    backgroundColor: 'rgba(31, 31, 48, 0.7)', // Hafif opak arka plan rengi
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
    marginTop: theme.spacing.xl,
  },
  startButton: {
    width: '80%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  startButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginRight: theme.spacing.sm,
  },
  finalQuote: {
    fontSize: theme.typography.fontSize.md,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
  },
  finalQuoteText: {
    backgroundColor: 'rgba(31, 31, 48, 0.8)', // Yazıyı çevreleyecek hafif arka plan
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  }
});
