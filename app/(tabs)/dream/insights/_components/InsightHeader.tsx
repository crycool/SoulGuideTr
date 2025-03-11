import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../../../../theme';

const { width } = Dimensions.get('window');

interface InsightHeaderProps {
  title: string;
  dreamCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

/**
 * İçgörüler sayfasının başlık bileşeni
 * Ana içgörü başlığını ve sayaçları gösterir
 */
const InsightHeader: React.FC<InsightHeaderProps> = ({
  title,
  dreamCount,
  onRefresh,
  isLoading
}) => {
  // Animasyon referansı
  const animationRef = useRef<Animatable.View & View>(null);
  
  // Refresh butonu animasyonu
  useEffect(() => {
    if (isLoading && animationRef.current) {
      animationRef.current.animate({ 0: { rotate: '0deg' }, 1: { rotate: '360deg' } }, 1000, 'linear');
    }
  }, [isLoading]);
  
  return (
    <Animatable.View 
      animation="fadeIn"
      duration={1000}
      style={styles.headerContainer}
    >
      <LinearGradient
        colors={['rgba(247, 203, 47, 0.3)', 'rgba(247, 203, 47, 0.0)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}
      >
        {/* Başlık alanı */}
        <View style={styles.titleContainer}>
          <Animatable.View 
            animation="pulse"
            iterationCount="infinite"
            duration={3000}
            style={styles.iconContainer}
          >
            <Ionicons name="eye" size={24} color={theme.colors.primary} />
          </Animatable.View>
          
          <View style={styles.titleTextContainer}>
            <Text style={styles.titleLabel}>ANA İÇGÖRÜ</Text>
            <Animatable.Text 
              animation="fadeIn"
              delay={500}
              style={styles.titleText}
            >
              {title}
            </Animatable.Text>
          </View>
        </View>
        
        {/* Alt bilgi alanı */}
        <View style={styles.infoContainer}>
          <View style={styles.dreamCountContainer}>
            <Ionicons name="moon" size={16} color={theme.colors.primary} />
            <Text style={styles.dreamCountText}>
              {dreamCount} Rüya Analiz Edildi
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={isLoading}
          >
            <Animatable.View ref={animationRef}>
              <Ionicons 
                name="refresh" 
                size={18} 
                color={isLoading ? theme.colors.textSecondary : theme.colors.primary} 
              />
            </Animatable.View>
            <Text style={[
              styles.refreshText,
              isLoading && styles.loadingText
            ]}>
              {isLoading ? 'Yenileniyor...' : 'İçgörüleri Yenile'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  headerGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.35)',
  },
  titleContainer: {
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
    borderColor: 'rgba(247, 203, 47, 0.35)',
  },
  titleTextContainer: {
    flex: 1,
  },
  titleLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 1,
  },
  titleText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    lineHeight: 30,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  dreamCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dreamCountText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 48, 0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  refreshText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  loadingText: {
    color: theme.colors.textSecondary,
  },
});

export default InsightHeader;