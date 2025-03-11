import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { DreamRecord } from '../../_utils/messageTypes';
import { DREAM_TAGS } from '../../_utils/chatPrompts';
import { theme } from '../../../../theme';

interface PersonalNotesProps {
  formData: DreamRecord;
  onUpdate: (data: Partial<DreamRecord>) => void;
  errors?: Record<string, string>;
}

export const PersonalNotes: React.FC<PersonalNotesProps> = ({
  formData,
  onUpdate,
  errors
}) => {
  const [customTagInput, setCustomTagInput] = useState('');

  const handleAddTag = () => {
    if (customTagInput.trim() && !formData.tags.includes(customTagInput.trim())) {
      onUpdate({ tags: [...formData.tags, customTagInput.trim()] });
      setCustomTagInput('');
    }
  };

  const handleTagToggle = (tag: string) => {
    if (formData.tags.includes(tag)) {
      onUpdate({ tags: formData.tags.filter(t => t !== tag) });
    } else {
      onUpdate({ tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Kişisel Notlar</Text>
        <TextInput
          style={styles.notesInput}
          value={formData.personalNotes}
          onChangeText={(text) => onUpdate({ personalNotes: text })}
          placeholder="Rüyanızla ilgili eklemek istediğiniz notlar..."
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Etiketler ve Arketipler</Text>
        <Text style={styles.description}>Rüyanızı kategorize etmek için etiketler seçin. AI analizi sonucunda tespit edilen Jungian arketipler otomatik olarak eklenir.</Text>
        
        <View style={styles.tagsGrid}>
          {DREAM_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagOption,
                formData.tags.includes(tag) && styles.tagOptionSelected
              ]}
              onPress={() => handleTagToggle(tag)}
            >
              <Text 
                style={[
                  styles.tagOptionText,
                  formData.tags.includes(tag) && styles.tagOptionTextSelected
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customTagContainer}>
          <Text style={styles.sectionSubtitle}>Özel etiket ekle:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.tagInput}
              value={customTagInput}
              onChangeText={setCustomTagInput}
              placeholder="Etiket girin..."
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.selectedTagsContainer}>
          <Text style={styles.sectionSubtitle}>Seçili etiketler:</Text>
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.tag}
                onPress={() => handleRemoveTag(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Text style={styles.removeTag}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Tekrarlayan Rüya</Text>
            <Switch
              value={formData.isRecurring}
              onValueChange={(value) => onUpdate({ isRecurring: value })}
              trackColor={{ false: '#333', true: theme.colors.secondary }}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          <Text style={styles.description}>Bu rüyayı daha önce de gördünüz mü?</Text>
        </View>

        <View style={styles.toggleContainer}>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Lucid Rüya</Text>
            <Switch
              value={formData.isLucid}
              onValueChange={(value) => onUpdate({ isLucid: value })}
              trackColor={{ false: '#333', true: theme.colors.secondary }}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          <Text style={styles.description}>Rüyada olduğunuzun farkında mıydınız?</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  notesInput: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    height: 120,
    fontSize: theme.typography.fontSize.md,
    textAlignVertical: 'top',
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tagOption: {
    backgroundColor: 'rgba(30, 30, 45, 0.5)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagOptionSelected: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  tagOptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  tagOptionTextSelected: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
  },
  customTagContainer: {
    marginTop: theme.spacing.md,
  },
  selectedTagsContainer: {
    marginTop: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    marginRight: theme.spacing.sm,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButton: {
    backgroundColor: theme.colors.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  addButtonText: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: theme.typography.fontWeight.bold,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  tagText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  removeTag: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  toggleContainer: {
    marginBottom: theme.spacing.md,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  toggleLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
});

export default PersonalNotes;