import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../../../../theme';

// Ekran genişliğini al
const { width } = Dimensions.get('window');

interface InsightCardProps {
  title: string;
  content: string;
  onPress: () => void;
  index: number;
  iconName?: string;
  gradientColors?: string[];
  isLocked?: boolean;
  requiredDreams?: number;
}

/**
 * İçgörü kartı bileşeni
 * İçgörünün başlığını ve kısa içeriğini gösterir
 */
const InsightCard: React.FC<InsightCardProps> = ({
  title,
  content,
  onPress,
  index,
  iconName = 'sparkles',
  gradientColors = ['#9b59b640', '#9b59b610'],
  isLocked = false,
  requiredDreams
}) => {
  // Görüntülenme animasyonunu geciktirmek için
  const animationDelay = 300 + (index * 200);
  
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={animationDelay}
      duration={800}
      style={styles.cardContainer}
    >
      <TouchableOpacity 
        style={styles.touchable}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.cardGradient}
        >
          {/* İçgörü ikonu */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name={isLocked ? "lock-closed" : iconName as any} 
              size={24} 
              color={isLocked ? theme.colors.textSecondary : theme.colors.primary} 
            />
          </View>
          
          {/* İçgörü başlığı */}
          <Text style={[
            styles.title, 
            isLocked && styles.lockedTitle
          ]}>
            {title}
          </Text>
          
          {/* İçgörü içeriği - kilitliyse farklı göster */}
          {isLocked ? (
            <View style={styles.lockedContent}>
              <Text style={styles.lockedText}>
                Bu içgörü {requiredDreams} rüya kaydettikten sonra açılacak
              </Text>
              <View style={styles.lockInfoContainer}>
                <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.lockInfoText}>
                  Daha fazla rüya = Daha derin içgörüler
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.content} numberOfLines={3}>
              {content}
            </Text>
          )}
          
          {/* Devamını görüntüle butonu */}
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>
              {isLocked ? "Kilidi Açmak İçin" : "Devamını Görüntüle"}
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={theme.colors.textSecondary} 
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

// Farklı içgörü kartları için gradient renkleri
export const insightGradients = [
  ['#9b59b640', '#9b59b610'], // Mor
  ['#3498db40', '#3498db10'], // Mavi
  ['#e74c3c40', '#e74c3c10'], // Kırmızı
  ['#f1c40f40', '#f1c40f10'], // Sarı
  ['#2ecc7140', '#2ecc7110']  // Yeşil
];

// Farklı içgörü kartları için ikonlar
export const insightIcons = [
  'sparkles',
  'bulb',
  'planet',
  'moon',
  'star'
];

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  touchable: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 180,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  lockedTitle: {
    color: theme.colors.textSecondary,
  },
  content: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  lockedContent: {
    marginBottom: theme.spacing.md,
  },
  lockedText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  lockInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
  },
  lockInfoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
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
});

export default InsightCard;