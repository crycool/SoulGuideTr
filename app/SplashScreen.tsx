import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from './theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const symbolsAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const taglineFadeAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Semboller animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,  // Hızlandırılmış animasyon
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(symbolsAnim, {
        toValue: 1,
        duration: 20000, // Daha hızlı dönüş
        useNativeDriver: true,
      }),
    ]).start();

    // Başlık animasyonu
    Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Slogan animasyonu
    Animated.timing(taglineFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 1000,
      useNativeDriver: true,
    }).start();
    
    // Loading bar animasyonu
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false
    }).start();

    // Splash ekranını kapatma (daha kısa süre)
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, titleFadeAnim, taglineFadeAnim, symbolsAnim, loadingAnim, onFinish]);

  // Dönüş animasyonları
  const spin = symbolsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const inverseSpin = symbolsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a18', '#1a1a30']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Arka plan yıldızlar (sabit) */}
        <View style={styles.starsContainer}>
          {[...Array(30)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: Math.random() * 1.5 + 0.5,
                  height: Math.random() * 1.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.1,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.contentContainer}>
          {/* Sembol Çemberleri ve İçerikleri */}
          <Animated.View
            style={[
              styles.symbolsContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            {/* Dış Çember */}
            <View style={styles.outerCircle} />
            
            {/* Orta Çember */}
            <View style={styles.middleCircle} />
            
            {/* İç Çember */}
            <View style={styles.innerCircle} />
            
            {/* Astroloji Sembolleri Dış Çember - Döner */}
            <Animated.View style={[
              styles.astrologySymbols,
              { transform: [{ rotate: spin }] }
            ]}>
              {/* Koç */}
              <View style={[styles.astrologySymbol, {top: -70}]}>
                <View style={styles.ariesSymbol} />
              </View>
              
              {/* Aslan */}
              <View style={[styles.astrologySymbol, {right: -70}]}>
                <View style={styles.leoSymbol} />
              </View>
              
              {/* Terazi */}
              <View style={[styles.astrologySymbol, {bottom: -70}]}>
                <View style={styles.libraSymbol} />
              </View>
              
              {/* Kova */}
              <View style={[styles.astrologySymbol, {left: -70}]}>
                <View style={styles.aquariusSymbol} />
              </View>
            </Animated.View>
            
            {/* Numeroloji Sembolleri Orta Çember - Ters döner */}
            <Animated.View style={[
              styles.numerologySymbols,
              { transform: [{ rotate: inverseSpin }] }
            ]}>
              {/* Fibonacci */}
              <View style={[styles.numerologySymbol, {top: -35, right: -35}]}>
                <View style={styles.fibonacciSymbol} />
              </View>
              
              {/* 7 Rakamı */}
              <View style={[styles.numerologySymbol, {bottom: -35, right: -35}]}>
                <View style={styles.sevenSymbol} />
              </View>
              
              {/* Üçgen */}
              <View style={[styles.numerologySymbol, {bottom: -35, left: -35}]}>
                <View style={styles.triangleSymbol} />
              </View>
              
              {/* Sonsuzluk */}
              <View style={[styles.numerologySymbol, {top: -35, left: -35}]}>
                <View style={styles.infinitySymbol} />
              </View>
            </Animated.View>
            
            {/* Meditasyon & Rüya Sembolleri İç Çember */}
            <View style={styles.meditationSymbols}>
              {/* Om */}
              <View style={[styles.meditationSymbol, {top: -30}]}>
                <View style={styles.omSymbol} />
              </View>
              
              {/* Ay */}
              <View style={[styles.meditationSymbol, {bottom: -21, right: -21}]}>
                <View style={styles.moonSymbol} />
              </View>
              
              {/* Lotus */}
              <View style={[styles.meditationSymbol, {bottom: -21, left: -21}]}>
                <View style={styles.lotusSymbol} />
              </View>
              
              {/* Yıldızlar */}
              <View style={[styles.meditationSymbol, {bottom: -30}]}>
                <View style={styles.starsSymbol} />
              </View>
            </View>
            
            {/* Merkez Nokta */}
            <View style={styles.centerPoint} />
          </Animated.View>

          {/* Uygulama Adı */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleFadeAnim,
                transform: [
                  {
                    translateY: titleFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            SoulGuide
          </Animated.Text>

          {/* Slogan */}
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: taglineFadeAnim,
                transform: [
                  {
                    translateY: taglineFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            İçsel Yolculuk
          </Animated.Text>
          
          {/* Yükleme Çubuğu */}
          <View style={styles.loadingBarContainer}>
            <View style={styles.loadingBarBg} />
            <Animated.View 
              style={[
                styles.loadingBarProgress,
                { width: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  starsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  symbolsContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  centerPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f1c40f',
    position: 'absolute',
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.7)',
    position: 'absolute',
  },
  middleCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.7)',
    position: 'absolute',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.7)',
    position: 'absolute',
  },
  astrologySymbols: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  astrologySymbol: {
    position: 'absolute',
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ariesSymbol: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f1c40f',
  },
  leoSymbol: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f1c40f',
  },
  libraSymbol: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f1c40f',
  },
  aquariusSymbol: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f1c40f',
  },
  numerologySymbols: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  numerologySymbol: {
    position: 'absolute',
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fibonacciSymbol: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e67e22',
  },
  sevenSymbol: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e67e22',
  },
  triangleSymbol: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e67e22',
  },
  infinitySymbol: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e67e22',
  },
  meditationSymbols: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  meditationSymbol: {
    position: 'absolute',
    width: 6,
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  omSymbol: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9b59b6',
  },
  moonSymbol: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9b59b6',
  },
  lotusSymbol: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9b59b6',
  },
  starsSymbol: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9b59b6',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
    textShadowColor: 'rgba(241, 196, 15, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#e67e22',
    marginBottom: 40,
    textShadowColor: 'rgba(230, 126, 34, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  loadingBarContainer: {
    width: 140,
    height: 2,
    backgroundColor: 'transparent',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loadingBarBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(241, 196, 15, 0.3)',
    borderRadius: 1,
  },
  loadingBarProgress: {
    height: '100%',
    backgroundColor: '#e67e22',
    borderRadius: 1,
  }
});

export default SplashScreen;