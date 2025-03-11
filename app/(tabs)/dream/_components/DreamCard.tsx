import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DreamRecord } from '../_utils/messageTypes';
import { theme } from '../../../theme';

interface DreamCardProps {
  dream: DreamRecord;
  onPress: () => void;
  onLongPress?: () => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onPress, onLongPress }) => {
  // Rüyadan kısa bir özet oluştur (ilk 120 karakter)
  const dreamSummary = dream.dreamContent.length > 120
    ? `${dream.dreamContent.substring(0, 120)}...`
    : dream.dreamContent;

  // Türkçe tarih formatı
  const formatDate = (date: Date) => {
    // Ay adları
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Düzenlenmiş duygular için ikon alma fonksiyonu
  const getEmotionIcon = (emotion: string): string => {
    const emotionIcons: Record<string, string> = {
      'mutluluk': 'emoticon-happy',
      'sevinç': 'emoticon-happy-outline',
      'üzüntü': 'emoticon-sad',
      'hüzün': 'emoticon-sad-outline',
      'korku': 'ghost',
      'endişe': 'alert-circle',
      'şaşkınlık': 'emoticon-surprised',
      'heyecan': 'lightning-bolt',
      'öfke': 'fire',
      'kızgınlık': 'emoticon-angry',
      'utanma': 'emoticon-frown',
      'suçluluk': 'handcuffs',
      'umut': 'star',
      'merak': 'magnify',
      'huzur': 'heart-pulse',
      'sevgi': 'heart',
    };
    
    const normalizedEmotion = emotion.toLowerCase();
    return emotionIcons[normalizedEmotion] || 'emoticon-neutral';
  };
  
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={800}
    >
      <Animatable.View 
        animation="fadeIn"
        duration={600}
        style={styles.containerAnimated}
      >
        <LinearGradient
          colors={['rgba(50, 30, 100, 0.5)', 'rgba(40, 25, 90, 0.5)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.container}
        >
          <View style={styles.header}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons name="calendar" size={14} color={theme.colors.textSecondary} style={styles.dateIcon} />
              <Text style={styles.date}>
                {formatDate(new Date(dream.date))}
              </Text>
            </View>
            <View style={styles.qualityContainer}>
              <Text style={styles.qualityLabel}>Kalite:</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialCommunityIcons
                    key={star}
                    name={star <= dream.dreamClarity ? "star" : "star-outline"}
                    size={14}
                    color={star <= dream.dreamClarity ? theme.colors.primary : theme.colors.textSecondary}
                    style={styles.starIcon}
                  />
                ))}
              </View>
            </View>
          </View>
          
          <Text style={styles.dreamContent}>{dreamSummary}</Text>
          
          <View style={styles.footer}>
            <View style={styles.emotionsContainer}>
              {dream.emotions.duringDream.slice(0, 3).map((emotion, index) => (
                <View key={index} style={styles.emotionTag}>
                  <MaterialCommunityIcons 
                    name={getEmotionIcon(emotion)} 
                    size={12} 
                    color={theme.colors.text} 
                    style={styles.emotionIcon} 
                  />
                  <Text style={styles.emotionText}>{emotion}</Text>
                </View>
              ))}
              {dream.emotions.duringDream.length > 3 && (
                <Text style={styles.moreEmotions}>+{dream.emotions.duringDream.length - 3}</Text>
              )}
            </View>

            <View style={styles.badgesContainer}>
              {dream.isRecurring && (
                <View style={styles.badge}>
                  <MaterialCommunityIcons name="repeat" size={10} color={theme.colors.text} style={{marginRight: 4}} />
                  <Text style={styles.badgeText}>Tekrarlayan</Text>
                </View>
              )}
              {dream.isLucid && (
                <View style={[styles.badge, styles.lucidBadge]}>
                  <MaterialCommunityIcons name="lightbulb-on" size={10} color={theme.colors.text} style={{marginRight: 4}} />
                  <Text style={styles.badgeText}>Lucid</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerAnimated: {
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  container: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  qualityLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    marginRight: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 1,
  },
  dreamContent: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  emotionTag: {
    backgroundColor: 'rgba(56, 161, 236, 0.15)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionIcon: {
    marginRight: 4,
  },
  emotionText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
  },
  moreEmotions: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(74, 20, 140, 0.7)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lucidBadge: {
    backgroundColor: 'rgba(26, 35, 126, 0.7)',
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
  },
});

export default DreamCard;