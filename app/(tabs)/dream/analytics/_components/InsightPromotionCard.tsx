import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { theme } from '../../../../theme';

const { width } = Dimensions.get('window');

interface InsightPromotionCardProps {
  dreamCount: number;
}

/**
 * İçgörüler sayfasına yönlendiren promosyon kartı
 * Analizler sayfasının altında gösterilir
 */
const InsightPromotionCard: React.FC<InsightPromotionCardProps> = ({ dreamCount = 0 }) => {
  const router = useRouter();
  
  // İçgörüler sayfasına git
  const navigateToInsights = () => {
    router.push('/dream/insights');
  };
  
  // Düğme metnini ayarla
  const getButtonText = () => {
    if (dreamCount === 0) {
      return 'Rüya Kaydetmeye Başla';
    } else if (dreamCount < 3) {
      return 'Daha Fazla Rüya Kaydet';
    } else {
      return 'İçgörüleri Keşfet';
    }
  };
  
  // İçerik metnini ayarla
  const getContentText = () => {
    if (dreamCount === 0) {
      return 'Bilinçaltınızın derinliklerini keşfetmek için ilk rüyanızı kaydedin.';
    } else if (dreamCount < 3) {
      return `Şu ana kadar ${dreamCount} rüya kaydettiniz. İçgörülerinizin kilidi ${3 - dreamCount} rüya daha kaydedildiğinde açılacak.`;
    } else {
      return 'Rüyalarınızdan derin psikolojik içgörüler elde edin ve bilinçaltınızdaki gizli örüntüleri keşfedin.';
    }
  };
  
  // Kendi yolunu belirle (rüya sayısına göre neye tıklayınca nereye gidecek)
  const handleCardPress = () => {
    if (dreamCount < 3) {
      // Yeterli rüya yoksa, rüya chat sayfasına yönlendir
      router.push('/dream/chat');
    } else {
      // Yeterli rüya varsa, içgörüler sayfasına yönlendir
      navigateToInsights();
    }
  };
  
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={1000}
      duration={800}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(155, 89, 182, 0.3)', 'rgba(155, 89, 182, 0.1)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            {/* Başlık ve İkon */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={2000}
                >
                  <Ionicons name="eye" size={24} color={theme.colors.secondary} />
                </Animatable.View>
              </View>
              
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Şaşırtıcı İçgörüler</Text>
                <Text style={styles.subtitle}>Bilinçaltınızın Gizli Mesajları</Text>
              </View>
            </View>
            
            {/* İçerik */}
            <Text style={styles.content}>
              {getContentText()}
            </Text>
            
            {/* Aksiyon Düğmesi */}
            <Animatable.View
              animation="pulse"
              iterationCount={3}
              duration={2000}
            >
              <TouchableOpacity 
                style={[
                  styles.button,
                  { backgroundColor: dreamCount < 3 ? theme.colors.secondary : '#8e44ad' }
                ]}
                onPress={handleCardPress}
              >
                <Text style={styles.buttonText}>{getButtonText()}</Text>
                <Ionicons 
                  name={dreamCount < 3 ? "add-circle" : "chevron-forward"} 
                  size={18} 
                  color="white" 
                />
              </TouchableOpacity>
            </Animatable.View>
            
            {/* Bilgi Rozeti */}
            {dreamCount >= 3 && (
              <View style={styles.badgeContainer}>
                <Ionicons name="sparkles" size={12} color={theme.colors.secondary} />
                <Text style={styles.badgeText}>Yeni</Text>
              </View>
            )}
          </View>
          
          {/* Zemin Deseni */}
          <View style={styles.patternContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.patternCircle,
                  {
                    top: `${35 + (index * 20)}%`,
                    right: `${5 + (index * 8)}%`,
                    width: 100 - (index * 25),
                    height: 100 - (index * 25),
                    opacity: 0.03 + (index * 0.01),
                  }
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
    borderRadius: theme.borderRadius.lg,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  content: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: theme.typography.fontSize.md,
    color: 'white',
    fontWeight: theme.typography.fontWeight.medium,
    marginRight: theme.spacing.sm,
  },
  badgeContainer: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    paddingVertical: theme.spacing.xs / 2,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.secondary,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.xs / 2,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 150,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
});

export default InsightPromotionCard;