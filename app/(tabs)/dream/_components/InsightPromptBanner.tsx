import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../theme';

interface InsightPromptBannerProps {
  dreamCount: number;
}

/**
 * Arşiv sayfasında gösterilen içgörülere yönlendirme banner'ı
 */
const InsightPromptBanner: React.FC<InsightPromptBannerProps> = ({ dreamCount }) => {
  const router = useRouter();
  
  // İçgörüler sayfasına yönlendir
  const navigateToInsights = () => {
    if (dreamCount >= 3) {
      router.push('/dream/insights');
    } else {
      router.push('/dream/chat');
    }
  };
  
  // Henüz yeterli rüya kaydedilmemişse farklı mesaj göster
  const getMessage = () => {
    if (dreamCount < 3) {
      return `İçgörülerinizin kilidi için ${3 - dreamCount} rüya daha kaydedin.`;
    }
    return 'Rüyalarınızdaki gizli örüntüleri ve içgörüleri keşfedin!';
  };
  
  return (
    <Animatable.View
      animation="fadeIn"
      duration={800}
      delay={500}
      style={styles.container}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={navigateToInsights}
        style={styles.touchable}
      >
        <LinearGradient
          colors={['rgba(155, 89, 182, 0.3)', 'rgba(155, 89, 182, 0.1)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
            >
              <Ionicons name="eye" size={22} color={theme.colors.secondary} />
            </Animatable.View>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Bilinçaltı İçgörüleri</Text>
            <Text style={styles.message}>{getMessage()}</Text>
          </View>
          
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={theme.colors.textSecondary}
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  touchable: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
});

export default InsightPromptBanner;