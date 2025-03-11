import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../../../../theme';

interface InsightProgressProps {
  dreamCount: number;
  nextMilestone: number;
}

/**
 * İçgörü ilerleme durumu bileşeni
 * Kullanıcının kaydettiği rüya sayısını ve ilerlemeyi gösterir
 */
const InsightProgress: React.FC<InsightProgressProps> = ({
  dreamCount,
  nextMilestone
}) => {
  // Yüzde hesapla
  const progressPercent = Math.min(100, (dreamCount / nextMilestone) * 100);
  
  // İçgörü seviyesi hesapla (1-5 arası)
  const insightLevel = Math.min(5, Math.max(1, Math.ceil(dreamCount / 5)));
  
  // Seviyeye göre metin belirle
  const getLevelText = () => {
    switch (insightLevel) {
      case 1:
        return 'Başlangıç';
      case 2:
        return 'Gelişiyor';
      case 3:
        return 'Derinleşiyor';
      case 4:
        return 'İlerlemiş';
      case 5:
        return 'Usta';
      default:
        return 'Başlangıç';
    }
  };
  
  return (
    <Animatable.View
      animation="fadeIn"
      delay={800}
      duration={600}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(31, 31, 48, 0.95)', 'rgba(31, 31, 48, 0.85)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}
      >
        <Text style={styles.title}>Bilinçaltı Keşif Seviyeniz</Text>
        
        {/* Seviye göstergesi */}
        <View style={styles.levelContainer}>
          {[1, 2, 3, 4, 5].map((level) => (
            <View 
              key={level}
              style={[
                styles.levelDot,
                level <= insightLevel ? styles.activeLevelDot : null,
                level === insightLevel ? styles.currentLevelDot : null
              ]}
            />
          ))}
        </View>
        
        {/* Seviye bilgisi */}
        <View style={styles.levelInfoContainer}>
          <View style={styles.levelTextContainer}>
            <Text style={styles.levelLabel}>SEVİYE {insightLevel}</Text>
            <Text style={styles.levelText}>{getLevelText()}</Text>
          </View>
          
          <View 
            style={[
              styles.levelBadge,
              { backgroundColor: `rgba(247, 203, 47, ${insightLevel * 0.15})` }
            ]}
          >
            <Ionicons 
              name={insightLevel >= 5 ? "star" : "star-outline"} 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={styles.levelBadgeText}>
              {dreamCount} Rüya
            </Text>
          </View>
        </View>
        
        {/* İlerleme çubuğu */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercent}%` }
              ]} 
            />
          </View>
          
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {nextMilestone - dreamCount} rüya daha kaydedin
            </Text>
            <Text style={styles.milestoneText}>
              {dreamCount}/{nextMilestone}
            </Text>
          </View>
        </View>
        
        {/* İpucu */}
        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.tipText}>
            Her 5 rüya, yeni içgörüler ve derinlikler açar
          </Text>
        </View>
      </LinearGradient>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  gradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeLevelDot: {
    backgroundColor: theme.colors.primary,
  },
  currentLevelDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  levelInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  levelTextContainer: {
    flex: 1,
  },
  levelLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  levelText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(247, 203, 47, 0.15)',
  },
  levelBadgeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  milestoneText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 48, 0.7)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.2)',
  },
  tipText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
});

export default InsightProgress;