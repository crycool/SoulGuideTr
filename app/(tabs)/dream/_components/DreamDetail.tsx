import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DreamRecord } from '../_utils/messageTypes';
import { theme } from '../../../theme';

interface DreamDetailProps {
  dream: DreamRecord;
}

const DreamDetail: React.FC<DreamDetailProps> = ({ dream }) => {
  const router = useRouter();
  
  // Debug: Arketip verilerini kontrol et
  console.log('Dream Tags (Arketipler):', dream.tags);
  console.log('Dream Tags Uzunluk:', dream?.tags?.length || 0);
  console.log('Dream Tags Koşul Sonucu:', !!(dream.tags && dream.tags.length > 0));
  
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {formatDate(new Date(dream.date))}
        </Text>
        <View style={styles.badgesContainer}>
          {dream.isRecurring && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Tekrarlayan</Text>
            </View>
          )}
          {dream.isLucid && (
            <View style={[styles.badge, styles.lucidBadge]}>
              <Text style={styles.badgeText}>Lucid</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rüya İçeriği</Text>
        <Text style={styles.dreamContent}>{dream.dreamContent}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Yorumu</Text>
        <Text style={styles.dreamContent}>{dream.aiInterpretation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rüya Kalitesi</Text>
        <View style={styles.qualityRow}>
          <View style={styles.qualityItem}>
            <Text style={styles.qualityLabel}>Uyku Kalitesi</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.star,
                    { color: star <= dream.sleepQuality ? theme.colors.accent : theme.colors.textSecondary }
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.qualityItem}>
            <Text style={styles.qualityLabel}>Rüya Netliği</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.star,
                    { color: star <= dream.dreamClarity ? theme.colors.accent : theme.colors.textSecondary }
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duygular</Text>
        <View style={styles.tagsContainer}>
          {dream.emotions.duringDream.map((emotion, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{emotion}</Text>
            </View>
          ))}
        </View>
        <View style={styles.afterEmotionContainer}>
          <Text style={styles.afterEmotionLabel}>Rüya Sonrası Duygu:</Text>
          <Text style={styles.afterEmotion}>{dream.emotions.afterDream}</Text>
        </View>
      </View>

      {dream.elements.characters.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Karakterler</Text>
          <View style={styles.tagsContainer}>
            {dream.elements.characters.map((character, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{character}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {dream.elements.places.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mekanlar</Text>
          <View style={styles.tagsContainer}>
            {dream.elements.places.map((place, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{place}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {dream.elements.symbols.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Semboller</Text>
          <View style={styles.tagsContainer}>
            {dream.elements.symbols.map((symbol, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{symbol}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {dream.tags && dream.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arketipler</Text>
          <View style={styles.tagsContainer}>
            {dream.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, styles.archetypeTag]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {dream.themes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temalar</Text>
          <View style={styles.tagsContainer}>
            {dream.themes.map((theme, index) => (
              <View key={index} style={[styles.tag, styles.themeTag]}>
                <Text style={styles.tagText}>{theme}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {dream.personalNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kişisel Notlar</Text>
          <Text style={styles.dreamContent}>{dream.personalNotes}</Text>
        </View>
      )}
      
      {/* Analiz Yönlendirme Kartı */}
      <View style={styles.analysisPromptSection}>
        <Text style={styles.analysisPromptTitle}>
          <MaterialCommunityIcons name="lightbulb-outline" size={20} color={theme.colors.primary} /> 
          Rüya Analizleri ile Daha Fazla İçgörü Keşfedin
        </Text>
        
        <Text style={styles.analysisPromptText}>
          Kaydetmiş olduğunuz tüm rüyalarınızın
          duygusal örüntülerini, tekrarlayan temalarını ve sembolleri analiz edin.
          Rüya dünyanız hakkında derinlemesine içgörüler kazanın!
        </Text>
        
        <TouchableOpacity 
          style={styles.analysisButton}
          onPress={() => router.push('/(tabs)/dream/analytics')}
        >
          <MaterialCommunityIcons name="chart-bar" size={20} color={theme.colors.background} style={{marginRight: 8}} />
          <Text style={styles.analysisButtonText}>Analizlere Git</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(18, 18, 32, 0.95)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  date: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(155, 89, 182, 0.5)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
    ...theme.shadows.sm,
  },
  lucidBadge: {
    backgroundColor: 'rgba(52, 152, 219, 0.5)',
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  section: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.md,
  },
  dreamContent: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 24,
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityItem: {
    flex: 1,
  },
  qualityLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 20,
    marginRight: theme.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  themeTag: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  archetypeTag: {
    backgroundColor: 'rgba(142, 68, 173, 0.2)',
    borderColor: 'rgba(142, 68, 173, 0.3)',
  },
  tagText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
  },
  afterEmotionContainer: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  afterEmotionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    marginRight: theme.spacing.sm,
  },
  afterEmotion: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  analysisPromptSection: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
    ...theme.shadows.sm,
  },
  analysisPromptTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.analytics,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisPromptText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  analysisButton: {
    backgroundColor: theme.colors.analytics,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
    ...theme.shadows.sm,
  },
  analysisButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default DreamDetail;