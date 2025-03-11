import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DreamRecord } from '../../_utils/messageTypes';
import { theme } from '../../../../theme';

interface BasicDreamInfoProps {
  formData: DreamRecord;
  onUpdate: (data: Partial<DreamRecord>) => void;
  errors?: Record<string, string>;
}

export const BasicDreamInfo: React.FC<BasicDreamInfoProps> = ({
  formData,
  onUpdate,
  errors
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onUpdate({ date: selectedDate });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons name="calendar" size={22} color={theme.colors.primary} />
          <Text style={styles.label}>Rüya Tarihi</Text>
        </View>
        
        {Platform.OS === 'ios' ? (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              textColor={theme.colors.text}
              themeVariant="dark"
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons name="calendar-edit" size={20} color={theme.colors.primary} />
              <Text style={styles.dateButtonText}>{formatDate(formData.date)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </>
        )}
        
        {errors?.date && <Text style={styles.errorText}>{errors.date}</Text>}
      </View>

      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons name="sleep" size={22} color={theme.colors.primary} />
          <Text style={styles.label}>Uyku Kalitesi</Text>
        </View>
        
        <Text style={styles.value}>{formData.sleepQuality}/5</Text>
        
        <View style={styles.sliderContainer}>
          <MaterialCommunityIcons name="emoticon-sad-outline" size={22} color={theme.colors.textSecondary} />
          <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={formData.sleepQuality}
          onValueChange={(value) => onUpdate({ sleepQuality: value })}
          minimumTrackTintColor={theme.colors.secondary}
          maximumTrackTintColor="rgba(255,255,255,0.2)"
          thumbTintColor={theme.colors.primary}
          />
          <MaterialCommunityIcons name="emoticon-happy-outline" size={22} color={theme.colors.textSecondary} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons name="eye" size={22} color={theme.colors.primary} />
          <Text style={styles.label}>Rüya Netliği</Text>
        </View>
        
        <Text style={styles.value}>{formData.dreamClarity}/5</Text>
        
        <View style={styles.sliderContainer}>
          <MaterialCommunityIcons name="blur" size={22} color={theme.colors.textSecondary} />
          <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={formData.dreamClarity}
          onValueChange={(value) => onUpdate({ dreamClarity: value })}
          minimumTrackTintColor={theme.colors.accent}
          maximumTrackTintColor="rgba(255,255,255,0.2)"
          thumbTintColor={theme.colors.primary}
          />
          <MaterialCommunityIcons name="eye-check-outline" size={22} color={theme.colors.textSecondary} />
        </View>
      </View>
      
      <View style={styles.checkboxSection}>
        <TouchableOpacity 
          style={styles.checkboxRow}
          onPress={() => onUpdate({ isRecurring: !formData.isRecurring })}
        >
          <View style={[styles.checkbox, formData.isRecurring && styles.checkboxActive]}>
            {formData.isRecurring && <MaterialCommunityIcons name="check" size={18} color="white" />}
          </View>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxLabel}>Tekrarlayan Rüya</Text>
            <Text style={styles.checkboxDescription}>Bu rüyayı daha önce de gördüm</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.checkboxRow, {marginTop: 16}]}
          onPress={() => onUpdate({ isLucid: !formData.isLucid })}
        >
          <View style={[styles.checkbox, formData.isLucid && styles.checkboxActive]}>
            {formData.isLucid && <MaterialCommunityIcons name="check" size={18} color="white" />}
          </View>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxLabel}>Lucid Rüya</Text>
            <Text style={styles.checkboxDescription}>Rüyada olduğumun farkındaydım</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
    backgroundColor: 'rgba(30, 30, 45, 0.6)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.2)',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  value: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  pickerContainer: {
    alignItems: 'center',
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
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.sm,
  },
  dateButton: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  checkboxSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: 'rgba(30, 30, 45, 0.6)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.2)',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  checkboxActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  checkboxDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default BasicDreamInfo;