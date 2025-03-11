import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { DreamRecord } from '../../_utils/messageTypes';
import { COMMON_CHARACTERS, COMMON_PLACES, COMMON_SYMBOLS, DREAM_THEMES } from '../../_utils/chatPrompts';
import { theme } from '../../../../theme';

interface ContentDetailsProps {
  formData: DreamRecord;
  onUpdate: (data: Partial<DreamRecord>) => void;
  errors?: Record<string, string>;
}

interface TagInputProps {
  label: string;
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

const TagInput: React.FC<TagInputProps> = ({ label, tags, onTagsChange, placeholder, suggestions = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onTagsChange([...tags, suggestion]);
    }
  };

  return (
    <View style={styles.tagSection}>
      <Text style={styles.label}>{label}</Text>
      
      {/* Seçenekler listesi */}
      {suggestions.length > 0 && (
        <View>
          <Text style={styles.sectionSubtitle}>Yaygın seçenekler:</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
            {suggestions.map(suggestion => (
              <TouchableOpacity
                key={suggestion}
                style={[
                  styles.suggestionChip,
                  tags.includes(suggestion) && styles.selectedSuggestionChip
                ]}
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                <Text 
                  style={[
                    styles.suggestionText,
                    tags.includes(suggestion) && styles.selectedSuggestionText
                  ]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Etiket ekleme alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder || "Eklemek için yazın..."}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
          onFocus={handleInputFocus}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Seçilmiş etiketler */}
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
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
  );
};

export const ContentDetails: React.FC<ContentDetailsProps> = ({
  formData,
  onUpdate,
  errors
}) => {
  const handleElementsUpdate = (key: 'characters' | 'places' | 'symbols', newValues: string[]) => {
    onUpdate({
      elements: {
        ...formData.elements,
        [key]: newValues
      }
    });
  };

  const handleThemesUpdate = (newThemes: string[]) => {
    onUpdate({ themes: newThemes });
  };

  return (
    <ScrollView style={styles.container}>
      <TagInput
        label="Karakterler"
        tags={formData.elements.characters}
        onTagsChange={(newTags) => handleElementsUpdate('characters', newTags)}
        placeholder="Kendi karakterinizi ekleyin..."
        suggestions={COMMON_CHARACTERS}
      />

      <TagInput
        label="Mekanlar"
        tags={formData.elements.places}
        onTagsChange={(newTags) => handleElementsUpdate('places', newTags)}
        placeholder="Kendi mekanınızı ekleyin..."
        suggestions={COMMON_PLACES}
      />

      {/* Semboller bölümü - AI tarafından otomatik belirleniyor */}
      <View style={styles.tagSection}>
        <Text style={styles.label}>Semboller (AI Tarafından Belirlendi)</Text>
        {formData.elements.symbols && formData.elements.symbols.length > 0 ? (
          <View style={styles.tagsContainer}>
            {formData.elements.symbols.map((symbol) => (
              <View key={symbol} style={[styles.tag, styles.aiDeterminedTag]}>
                <Text style={[styles.tagText, styles.aiDeterminedTagText]}>{symbol}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noContentText}>AI tarafından belirlenmiş semboller bulunamadı.</Text>
        )}
      </View>

      {/* Temalar bölümü - AI tarafından otomatik belirleniyor */}
      <View style={styles.tagSection}>
        <Text style={styles.label}>Temalar (AI Tarafından Belirlendi)</Text>
        {formData.themes && formData.themes.length > 0 ? (
          <View style={styles.tagsContainer}>
            {formData.themes.map((theme) => (
              <View key={theme} style={[styles.tag, styles.aiDeterminedTag]}>
                <Text style={[styles.tagText, styles.aiDeterminedTagText]}>{theme}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noContentText}>AI tarafından belirlenmiş temalar bulunamadı.</Text>
        )}
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
  tagSection: {
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  input: {
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
  aiDeterminedTag: {
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  tagText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  aiDeterminedTagText: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  removeTag: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  suggestionChip: {
    backgroundColor: 'rgba(30, 30, 45, 0.5)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedSuggestionChip: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  suggestionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  selectedSuggestionText: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
  },
  noContentText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.md,
  },
});

export default ContentDetails;