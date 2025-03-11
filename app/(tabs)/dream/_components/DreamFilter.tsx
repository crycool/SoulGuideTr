import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { DreamFilterOptions } from '../_utils/messageTypes';
import { theme } from '../../../theme';

interface DreamFilterProps {
  options: DreamFilterOptions;
  onChange: (options: Partial<DreamFilterOptions>) => void;
  onClose: () => void;
  visible: boolean;
}

const DreamFilter: React.FC<DreamFilterProps> = ({
  options,
  onChange,
  onClose,
  visible
}) => {
  const [localOptions, setLocalOptions] = useState<DreamFilterOptions>({ ...options });

  const handleChange = (key: keyof DreamFilterOptions, value: any) => {
    setLocalOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onChange(localOptions);
    onClose();
  };

  const handleReset = () => {
    const resetOptions: DreamFilterOptions = {
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setLocalOptions(resetOptions);
    onChange(resetOptions);
  };

  const renderSortOptions = () => {
    const sortOptions = [
      { value: 'date', label: 'Tarih' },
      { value: 'sleepQuality', label: 'Uyku Kalitesi' },
      { value: 'dreamClarity', label: 'Rüya Netliği' }
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sıralama</Text>
        <View style={styles.optionsRow}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                localOptions.sortBy === option.value && styles.selectedOption
              ]}
              onPress={() => handleChange('sortBy', option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  localOptions.sortBy === option.value && styles.selectedOptionText
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.orderRow}>
          <TouchableOpacity
            style={[
              styles.orderButton,
              localOptions.sortOrder === 'asc' && styles.selectedOption
            ]}
            onPress={() => handleChange('sortOrder', 'asc')}
          >
            <Text
              style={[
                styles.orderText,
                localOptions.sortOrder === 'asc' && styles.selectedOptionText
              ]}
            >
              Artan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.orderButton,
              localOptions.sortOrder === 'desc' && styles.selectedOption
            ]}
            onPress={() => handleChange('sortOrder', 'desc')}
          >
            <Text
              style={[
                styles.orderText,
                localOptions.sortOrder === 'desc' && styles.selectedOptionText
              ]}
            >
              Azalan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCheckboxOptions = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rüya Tipleri</Text>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleChange('isRecurring', !localOptions.isRecurring)}
          >
            <View
              style={[
                styles.checkbox,
                localOptions.isRecurring && styles.checkedCheckbox
              ]}
            >
              {localOptions.isRecurring && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Tekrarlayan Rüyalar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleChange('isLucid', !localOptions.isLucid)}
          >
            <View
              style={[
                styles.checkbox,
                localOptions.isLucid && styles.checkedCheckbox
              ]}
            >
              {localOptions.isLucid && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Lucid Rüyalar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rüyaları Filtrele</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {renderSortOptions()}
            {renderCheckboxOptions()}
            
            {/* Buraya daha fazla filtre seçeneği eklenebilir */}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Sıfırla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  closeButton: {
    fontSize: 22,
    color: theme.colors.text,
  },
  modalBody: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  orderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  orderText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  checkboxRow: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
  },
  checkboxLabel: {
    color: theme.colors.text,
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetButtonText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  applyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DreamFilter;