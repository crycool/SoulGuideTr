import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../../../../theme';

const { width } = Dimensions.get('window');

interface LockedInsightProps {
  title: string;
  requiredDreams: number;
  currentDreams: number;
  onPress: () => void;
}

/**
 * Kilitli içgörü bileşeni
 * Belirli sayıda rüya görmeden açılamayan içgörüler için kullanılır
 */
const LockedInsight: React.FC<LockedInsightProps> = ({
  title,
  requiredDreams,
  currentDreams,
  onPress
}) => {
  // Yüzde hesapla
  const progressPercent = Math.min(100, (currentDreams / requiredDreams) * 100);
  
  return (
      <Animatable.View
        animation="fadeInUp"
        delay={500}
        duration={800}
        style={styles.container}
      >
        <TouchableOpacity 
          style={styles.touchable}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(247, 203, 47, 0.4)', 'rgba(230, 126, 34, 0.3)', 'rgba(211, 84, 0, 0.2)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradient}
          >
          {/* İkon ve başlık */}
          <View style={styles.headerRow}>
            <View style={styles.lockIconContainer}>
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
                style={styles.glowEffect}
              />
              <Ionicons name="lock-closed" size={24} color="#FFD700" />
            </View>
            
            <View style={styles.titleContainer}>
              <Text style={styles.lockedLabel}>ÖZEL İÇGÖRÜ • KİLİTLİ</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
          
          {/* İlerleme bilgisi */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              Bu özel içgörüyü açmak için <Text style={styles.progressHighlight}>{requiredDreams - currentDreams} rüya</Text> daha kaydedin
            </Text>
            
            {/* İlerleme çubuğu */}
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${progressPercent}%` }
                ]} 
              >
                <Animatable.View 
                  animation="pulse"
                  iterationCount="infinite"
                  duration={1500}
                  style={styles.progressBarGlow} 
                />
              </View>
            </View>
            
            <Text style={styles.progressCount}>
              <Text style={styles.progressHighlight}>{currentDreams}</Text> / {requiredDreams} Rüya
            </Text>
          </View>
          
          {/* Bilgi notu */}
          <View style={styles.infoContainer}>
            <View style={styles.infoTextContainer}>
              <Ionicons name="sparkles" size={18} color="#FFD700" />
              <Text style={styles.infoText}>
                Bu özel içgörü, <Text style={styles.infoTextHighlight}>bilincaltınızın derinliklerindeki gizli örüntüleri</Text> açığa çıkarır. Her rüya kaydınız sizi bu özel içgörüye bir adım daha yaklaştırır!
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.dreamButton}
              onPress={onPress}
            >
              <Text style={styles.dreamButtonText}>
                Hemen Rüya Kaydet
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  touchable: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.5)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  lockIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(31, 31, 48, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.7)',
    ...theme.shadows.sm,
    position: 'relative',
    zIndex: 1,
  },
  glowEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(247, 203, 47, 0.2)',
    zIndex: -1,
  },
  titleContainer: {
    flex: 1,
  },
  lockedLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFD700',
    marginBottom: theme.spacing.xs,
    letterSpacing: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFF',
  },
  progressSection: {
    marginBottom: theme.spacing.md,
  },
  progressText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  progressHighlight: {
    color: '#FFD700',
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: theme.borderRadius.full,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarGlow: {
    position: 'absolute',
    top: -5,
    right: -15,
    width: 30,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  progressCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  infoContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(31, 31, 48, 0.8)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.3)',
    ...theme.shadows.sm,
  },
  infoTextContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
  infoTextHighlight: {
    color: '#FFD700',
    fontWeight: theme.typography.fontWeight.medium,
  },
  dreamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    alignSelf: 'stretch',
  },
  dreamButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: '#FFD700',
    fontWeight: theme.typography.fontWeight.bold,
    marginRight: theme.spacing.sm,
  },
});

export default LockedInsight;