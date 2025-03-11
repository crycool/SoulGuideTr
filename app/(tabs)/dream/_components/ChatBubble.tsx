import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import DreamSaveModal from './DreamSaveModal';
import { theme } from '../../../theme';
import archetypeStore from '../_utils/archetypeStore';

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
  isInterpretation?: boolean;
  onSaveComplete?: () => void; // Kaydetme işlemi tamamlandığında çağrılacak callback
  originalContent?: string;
  fullAnalysis?: any;
}

// Arketip verilerini AsyncStorage'a kaydet
const saveTempArchetypes = async (archetypes: string[]) => {
  try {
    await archetypeStore.setArchetypes(archetypes);
    console.log('Arketipler global store\'a kaydedildi:', archetypes);
  } catch (error) {
    console.error('Arketip kaydetme hatası:', error);
  }
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isAI,
  isInterpretation = false,
  onSaveComplete,
  originalContent,
  fullAnalysis,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);

  // API yanıtındaki arketipleri kontrol et ve store'a kaydet
  useEffect(() => {
    if (fullAnalysis && fullAnalysis.archetypes && fullAnalysis.archetypes.length > 0) {
      console.log('ChatBubble - arketip verileri store\'a kaydediliyor:', fullAnalysis.archetypes);
      // Arketipleri global store'a kaydet (asenkron işlem)
      saveTempArchetypes(fullAnalysis.archetypes);
    }
  }, [fullAnalysis]);

  // Özel karşılama mesajı kontrolü
  const isWelcomeMessage = isAI && message.includes('Merhaba! 👋') && !isInterpretation;

  // Büyük ve süslü karşılama mesajı için özel render
  if (isWelcomeMessage) {
    return (
      <Animatable.View 
        animation="fadeIn" 
        duration={800} 
        style={styles.welcomeContainer}
      >
        <LinearGradient
          colors={['rgba(155, 89, 182, 0.2)', 'rgba(52, 152, 219, 0.2)', 'rgba(241, 196, 15, 0.2)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.welcomeGradient}
        >
          <Animatable.Text 
            animation="fadeIn" 
            delay={400} 
            style={styles.welcomeTitle}
          >
            Rüya Rehberinize Hoş Geldiniz
          </Animatable.Text>
          
          <Animatable.Text 
            animation="fadeIn" 
            delay={800} 
            style={styles.welcomeMessage}
          >
            {message.split('\n\n').map((paragraph, index) => (
              <Text key={index} style={styles.welcomeParagraph}>
                {paragraph}
                {index < message.split('\n\n').length - 1 && '\n\n'}
              </Text>
            ))}
          </Animatable.Text>
        </LinearGradient>
      </Animatable.View>
    );
  }

  const SavePrompt = () => (
    <Animatable.View 
      animation="fadeIn" 
      duration={800} 
      delay={500} 
      style={styles.savePromptContainer}
    >
      <Text style={styles.savePromptText}>
        Rüyanızdaki semboller, duygular ve kişisel içgörülerinizi derinlemesine keşfetmek ve rüya günlüğünüzde detaylı şekilde saklamak ister misiniz?
      </Text>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={() => {
          // Kaydetme ekranını açmadan önce, son kez arketipleri güncelle
          if (fullAnalysis?.archetypes?.length > 0) {
            archetypeStore.setArchetypes(fullAnalysis.archetypes);
          }
          setShowSaveModal(true);
        }}
      >
        <Text style={styles.saveButtonText}>✨ Rüya İçgörülerini Keşfet ve Kaydet</Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <Text style={styles.featureItem}>🌙 Rüya sembolleri analizi</Text>
        <Text style={styles.featureItem}>💫 Duygusal yolculuk haritası</Text>
        <Text style={styles.featureItem}>📔 Kişisel rüya günlüğü</Text>
      </View>
    </Animatable.View>
  );

  return (
    <>
      <Animatable.View 
        animation={isAI ? "fadeInLeft" : "fadeInRight"}
        duration={400}
        style={[
          styles.bubbleContainer,
          isAI ? styles.aiBubble : styles.userBubble
        ]}
      >
        <LinearGradient
          colors={isAI 
            ? ['rgba(30, 30, 45, 0.9)', 'rgba(31, 31, 48, 0.85)'] 
            : ['rgba(165, 94, 189, 0.8)', 'rgba(155, 89, 182, 0.7)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.bubble,
            isAI ? styles.aiBubbleColor : styles.userBubbleColor
          ]}
        >
          <Text style={[
            styles.messageText,
            isAI ? styles.aiMessageText : styles.userMessageText
          ]}>
            {message}
          </Text>
        </LinearGradient>

        {isAI && isInterpretation && <SavePrompt />}
      </Animatable.View>

      <DreamSaveModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        dreamContent={originalContent || message}
        aiInterpretation={message}
        onSaveComplete={onSaveComplete}
        fullAnalysis={fullAnalysis}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: theme.spacing.sm,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  userBubbleColor: {
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.4)',
  },
  aiBubbleColor: {
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.2)',
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: theme.colors.text,
  },
  aiMessageText: {
    color: theme.colors.text,
  },
  savePromptContainer: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  savePromptText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  saveButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  featuresContainer: {
    marginTop: theme.spacing.sm,
  },
  featureItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  // Karşılama mesajı stilleri
  welcomeContainer: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  welcomeGradient: {
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  welcomeMessage: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: 24,
    color: theme.colors.text,
  },
  welcomeParagraph: {
    marginBottom: theme.spacing.md,
  },
});

export default ChatBubble;