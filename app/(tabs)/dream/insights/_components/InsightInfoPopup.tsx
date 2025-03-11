import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../../../theme';

const { width } = Dimensions.get('window');

/**
 * İçgörü Bilgi Popup Kartı
 * İçgörü sayfasının önemini ve değerini kullanıcıya açıklayan bilgilendirme penceresi
 */
const InsightInfoPopup = () => {
  const [visible, setVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Popup'ı daha önce gösterip göstermediğimizi kontrol et
    const checkIfShownBefore = async () => {
      try {
        const hasShownInsightInfo = await AsyncStorage.getItem('has_shown_insight_info');
        
        // Eğer daha önce gösterilmemişse veya belirli bir sayıdan az gösterilmişse
        if (!hasShownInsightInfo || parseInt(hasShownInsightInfo) < 3) {
          // Sayfanın tamamen yüklenmesi için kısa bir gecikme
          setTimeout(() => {
            setVisible(true);
            Animated.timing(slideAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true
            }).start();
          }, 1000);
          
          // Gösterim sayısını arttır
          const newCount = hasShownInsightInfo ? parseInt(hasShownInsightInfo) + 1 : 1;
          await AsyncStorage.setItem('has_shown_insight_info', newCount.toString());
        }
      } catch (error) {
        console.error('Popup kontrol hatası:', error);
      }
    };
    
    checkIfShownBefore();
  }, []);
  
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setVisible(false);
    });
  };
  
  // Popup görünür değilse hiçbir şey render etme
  if (!visible) return null;
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.popupContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0]
                  })
                }
              ],
              opacity: slideAnim
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(24, 24, 40, 0.97)', 'rgba(40, 40, 70, 0.95)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
                style={styles.iconContainer}
              >
                <Ionicons name="bulb" size={28} color={theme.colors.primary} />
              </Animatable.View>
              
              <Text style={styles.title}>İçgörülerin Gücü</Text>
              
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.contentScroll}>
              <Text style={styles.subtitle}>Rüya Yolculuğunuzun Kalbi</Text>
              
              <Text style={styles.paragraph}>
                İçgörü bölümü, rüya modülünün sadece bir parçası değil, bütün modülün amacını ve 
                değerini tanımlayan kalbidir. Diğer bölümler (anasayfa, chat, arşiv, analiz) 
                veri toplar ve işlerken, içgörü bölümü bu verileri hayatınızda gerçek bir değişim 
                ve gelişim yaratan anlamlı içgörülere dönüştürür.
              </Text>
              
              <View style={styles.divider} />
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="key" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Bilinçaltınızın Anahtarı</Text>
                  <Text style={styles.featureText}>
                    Rüyalarınızdaki semboller, duygular ve temalar arasındaki bağlantıları analiz ederek
                    bilinçaltınızın mesajlarını çözümler.
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="trending-up" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Kişisel Gelişim Rehberi</Text>
                  <Text style={styles.featureText}>
                    Rüyalarınızdan elde edilen içgörüler, günlük hayatınızda uygulayabileceğiniz
                    somut kişisel gelişim önerileri sunar.
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="git-network" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Derinleşen Bağlantılar</Text>
                  <Text style={styles.featureText}>
                    Zaman içinde daha fazla rüya kaydettikçe, içgörüler daha da derinleşir ve
                    bilinçaltınızın gizli örüntüleri ortaya çıkar.
                  </Text>
                </View>
              </View>
              
              <View style={styles.noteContainer}>
                <Ionicons name="information-circle" size={20} color={theme.colors.secondary} />
                <Text style={styles.noteText}>
                  Ne kadar çok rüya kaydederseniz, içgörüleriniz o kadar derinleşir ve kişiselleşir.
                  Rüya kaydetmeye devam ederek içgörülerinizi kilidini açın!
                </Text>
              </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Anladım</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  popupContainer: {
    width: width * 0.85,
    maxHeight: '80%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  gradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(247, 203, 47, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.3)',
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  contentScroll: {
    padding: theme.spacing.md,
    maxHeight: '60%',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(247, 203, 47, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.secondary,
  },
  noteText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    alignItems: 'center',
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  }
});

export default InsightInfoPopup;