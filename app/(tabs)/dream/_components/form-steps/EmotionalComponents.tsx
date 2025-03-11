import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { DreamRecord } from '../../_utils/messageTypes';
import Slider from '@react-native-community/slider';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { EMOTION_TYPES, AFTER_EMOTIONS } from '../../_utils/chatPrompts';
import { theme } from '../../../../theme';

interface EmotionalComponentsProps {
  formData: DreamRecord;
  onUpdate: (data: Partial<DreamRecord>) => void;
  errors?: Record<string, string>;
}

const EMOTION_OPTIONS = EMOTION_TYPES;

export const EmotionalComponents: React.FC<EmotionalComponentsProps> = ({
  formData,
  onUpdate,
  errors
}) => {
  // Duygu yoğunluğu alanı kaldırıldığı için bu state kullanılmıyor
  const handleEmotionToggle = (emotion: string) => {
    const currentEmotions = formData.emotions.duringDream;
    let newEmotions;
    
    if (currentEmotions.includes(emotion)) {
      newEmotions = currentEmotions.filter(e => e !== emotion);
    } else {
      newEmotions = [...currentEmotions, emotion];
    }
    
    onUpdate({
      emotions: {
        ...formData.emotions,
        duringDream: newEmotions
      }
    });
  };

  // Farklı duygu kategorileri için renkler
  const getEmotionColor = (emotion: string) => {
    const positiveEmotions = ['Mutluluk', 'Huzur', 'Heyecan', 'Merak', 'Sevgi', 'Tatmin', 'Gurur', 'Memnuniyet', 'Cesaret', 'Başarı', 'Güven', 'Yakınlık', 'Nostalji'];
    const negativeEmotions = ['Korku', 'Endişe', 'Üzgün', 'Öfke', 'Utanma', 'Suçluluk', 'Hayal kırıklığı', 'Yalnızlık', 'İmtina', 'Panik', 'Güvensizlik', 'Kıskançlık', 'İhanet'];
    const neutralEmotions = ['Şaşkınlık', 'Özlem'];

    if (positiveEmotions.includes(emotion)) {
      return {
        bg: 'rgba(46, 204, 113, 0.2)',
        border: 'rgba(46, 204, 113, 0.5)',
        selectedBg: theme.colors.success,
      };
    } else if (negativeEmotions.includes(emotion)) {
      return {
        bg: 'rgba(231, 76, 60, 0.2)',
        border: 'rgba(231, 76, 60, 0.5)',
        selectedBg: theme.colors.error,
      };
    } else {
      return {
        bg: 'rgba(52, 152, 219, 0.2)',
        border: 'rgba(52, 152, 219, 0.5)',
        selectedBg: theme.colors.accent,
      };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="emoticon-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Rüya Sırasındaki Duygular</Text>
        </View>
        <Text style={styles.description}>Rüyanızda hissettiğiniz duyguları seçin</Text>
        
        <View style={styles.emotionsGrid}>
          {EMOTION_OPTIONS.map((emotion) => {
            const colors = getEmotionColor(emotion);
            const isSelected = formData.emotions.duringDream.includes(emotion);
            
            return (
              <Animatable.View
                key={emotion}
                animation={isSelected ? "pulse" : undefined}
                iterationCount={isSelected ? 1 : undefined}
                duration={500}
              >
                <TouchableOpacity
                  style={[
                    styles.emotionChip,
                    { backgroundColor: isSelected ? colors.selectedBg : colors.bg, 
                      borderColor: isSelected ? colors.selectedBg : colors.border }
                  ]}
                  onPress={() => handleEmotionToggle(emotion)}
                >
                  <Text style={[
                    styles.emotionChipText,
                    isSelected && styles.emotionChipTextSelected
                  ]}>
                    {emotion}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            );
          })}
        </View>
        
        {errors?.emotions && (
          <Text style={styles.errorText}>{errors.emotions}</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="emoticon-excited-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Rüya Sonrası Duygu</Text>
        </View>
        <Text style={styles.description}>Uyandığınızda nasıl hissettiniz?</Text>
        
        <View style={styles.afterEmotionsGrid}>
          {AFTER_EMOTIONS.map((emotion) => {
            const isSelected = formData.emotions.afterDream === emotion;
            
            return (
              <TouchableOpacity
                key={emotion}
                style={[
                  styles.afterEmotionChip,
                  isSelected && styles.afterEmotionChipSelected
                ]}
                onPress={() => onUpdate({
                  emotions: {
                    ...formData.emotions,
                    afterDream: emotion
                  }
                })}
              >
                <Text style={[
                  styles.afterEmotionChipText,
                  isSelected && styles.afterEmotionChipTextSelected
                ]}>
                  {emotion}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={formData.emotions.afterDream !== AFTER_EMOTIONS.find(e => e === formData.emotions.afterDream) ? formData.emotions.afterDream : ''}
            onChangeText={(text) => onUpdate({
              emotions: {
                ...formData.emotions,
                afterDream: text
              }
            })}
            placeholder="Kendi duygunuzu buraya yazın..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>
      </View>

      {/* Duygu Yoğunluğu bölümü kaldırıldı */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    backgroundColor: 'rgba(30, 30, 45, 0.6)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.2)',
    ...theme.shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -4,
  },
  emotionChip: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    margin: 4,
    borderWidth: 1,
    minWidth: 90,
    alignItems: 'center',
  },
  emotionChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emotionChipTextSelected: {
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  afterEmotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -4,
    marginBottom: theme.spacing.md,
  },
  afterEmotionChip: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.5)',
    minWidth: 100,
    alignItems: 'center',
  },
  afterEmotionChipSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  afterEmotionChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  afterEmotionChipTextSelected: {
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    padding: theme.spacing.sm,
    minHeight: 60,
  },
  intensityValue: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: theme.spacing.sm,
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  intensityLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});

export default EmotionalComponents;