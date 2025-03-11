import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { saveDream } from '../_services/dreamStorageService';
import { DreamRecord } from '../_utils/messageTypes';
import { theme } from '../../../theme';
import DreamSaveAlert from './DreamSaveAlert';
import { useRouter } from 'expo-router';
import archetypeStore from '../_utils/archetypeStore';

// Form adımları
import BasicDreamInfo from './form-steps/BasicDreamInfo';
import EmotionalComponents from './form-steps/EmotionalComponents';

interface DreamSaveModalProps {
  visible: boolean;
  onClose: () => void;
  dreamContent: string;
  aiInterpretation: string;
  onSaveComplete?: () => void; // Kaydetme işlemi tamamlandığında çağrılacak callback
  fullAnalysis?: any;
}

interface FormErrors {
  [key: string]: string;
}

// Global store'dan arketip verilerini al (senkron ve asenkron sürümler)
const getStoredArchetypes = () => {
  // Senkron sürüm - sadece bellekteki verileri kullanır
  const archetypes = archetypeStore.getArchetypesSync();
  console.log('Global store\'dan arketipler alindi (senkron):', archetypes);
  return archetypes;
};

const getStoredArchetypesAsync = async () => {
  // Asenkron sürüm - gerekirse AsyncStorage'dan yükler
  try {
    const archetypes = await archetypeStore.getArchetypes();
    console.log('Global store\'dan arketipler alindi (asenkron):', archetypes);
    return archetypes;
  } catch (error) {
    console.error('Arketip yükleme hatası:', error);
    return [];
  }
};

const initialFormData: DreamRecord = {
  id: Date.now().toString(),
  date: new Date(),
  dreamContent: '',
  aiInterpretation: '',
  sleepQuality: 3,
  dreamClarity: 3,
  emotions: {
    duringDream: [],
    afterDream: '',
  },
  elements: {
    characters: [],
    places: [],
    symbols: [],
  },
  themes: [],
  personalNotes: '',
  tags: [],
  isRecurring: false,
  isLucid: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const DreamFormHeader: React.FC<{
  step: number;
  totalSteps: number;
  onClose: () => void;
}> = ({ step, totalSteps, onClose }) => {
  const stepTitles = ['Temel Bilgiler', 'Duygusal Deneyim'];
  const stepIcons = ['chart-bell-curve', 'emoticon'];

  return (
    <LinearGradient
      colors={['rgba(155, 89, 182, 0.9)', 'rgba(52, 152, 219, 0.9)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name={stepIcons[step]} size={24} color="white" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>{stepTitles[step]}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          {Array(totalSteps)
            .fill(0)
            .map((_, index) => (
              <Animatable.View
                key={index}
                animation={index === step ? "pulse" : undefined}
                iterationCount={index === step ? "infinite" : undefined}
                duration={1500}
                style={[
                  styles.progressDot,
                  index <= step ? styles.progressDotActive : null,
                ]}
              />
            ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const DreamFormFooter: React.FC<{
  step: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isLastStep: boolean;
}> = ({ step, onPrevious, onNext, onSave, isLastStep }) => (
  <View style={styles.footer}>
    {step > 0 && (
      <TouchableOpacity onPress={onPrevious} style={styles.footerButton}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={theme.colors.primary} />
        <Text style={styles.footerButtonText}>Geri</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity
      onPress={isLastStep ? onSave : onNext}
      style={[styles.footerButton, styles.primaryButton]}
    >
      <Text style={styles.primaryButtonText}>
        {isLastStep ? 'Kaydet' : 'İleri'}
      </Text>
      <MaterialCommunityIcons 
        name={isLastStep ? "content-save" : "arrow-right"} 
        size={20} 
        color="white" 
        style={{marginLeft: 8}}
      />
    </TouchableOpacity>
  </View>
);

export const DreamSaveModal: React.FC<DreamSaveModalProps> = ({
  visible,
  onClose,
  dreamContent,
  aiInterpretation,
  onSaveComplete,
  fullAnalysis,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Arketip verilerini saklamak için güvenli bir yaklaşım
  const [archetypes, setArchetypes] = useState<string[]>([]);
  
  // Bileşen monte edildiğinde global store'dan arketipleri yükle
  useEffect(() => {
    const loadArchetypes = async () => {
      if (visible) { // Sadece modal açıkken yükle
        // Önce senkron yöntemle hızlı erişim dene
        let storedArchetypes = getStoredArchetypes();
        
        // Eğer bellekte arketip yoksa, asenkron olarak yükle
        if (storedArchetypes.length === 0) {
          console.log('Bellekte arketip bulunamadı, AsyncStorage\'dan yükleniyor...');
          storedArchetypes = await getStoredArchetypesAsync();
        }
        
        if (storedArchetypes.length > 0) {
          console.log('Yüklenen arketipler:', storedArchetypes);
          setArchetypes(storedArchetypes);
        } else if (fullAnalysis?.archetypes?.length > 0) {
          // Eğer store'da yoksa ve fullAnalysis'te varsa oradan al
          console.log('fullAnalysis\'ten alınan arketipler:', fullAnalysis.archetypes);
          setArchetypes(fullAnalysis.archetypes);
          // Store'a da kaydet
          await archetypeStore.setArchetypes(fullAnalysis.archetypes);
        }
        
        // Rüya netliğini varsayılan olarak 3 (orta) yap (5 üzerinden)
        onUpdate({ dreamClarity: 3 });
      }
    };
    
    loadArchetypes();
  }, [visible, fullAnalysis]);
  
  const [formData, setFormData] = useState<DreamRecord>(() => {
    // Default form verilerini oluştur
    return {
      ...initialFormData,
      dreamContent,
      aiInterpretation,
    };
  });
  
  // formData'yı güncelleyen useEffect
  useEffect(() => {
    // Modal görünür olduğunda formData'yı güncelle
    if (visible) {
      // fullAnalysis varsa, analiz verilerini yükle
      let symbols: string[] = [];
      let themes: string[] = [];
      
      if (fullAnalysis) {
        if (fullAnalysis.symbols) {
          symbols = fullAnalysis.symbols.map((s: any) => s.name);
        }
        
        // TEĞER fullAnalysis'te themes varsa, onu kullan
        if (fullAnalysis.mainTheme) {
          // Eğer theme yoksa ana temayı ekle
          themes = [fullAnalysis.mainTheme];
        }
      }
      
      // Global store'dan arketip verilerini al
      const currentArchetypes = getStoredArchetypes();
      
      // formData'yı güncelle
      setFormData(prev => ({
        ...prev,
        dreamContent,
        aiInterpretation: fullAnalysis 
          ? `Ana Tema: ${fullAnalysis.mainTheme}\n\nİçgörüler:\n${fullAnalysis.insights?.join('\n\n')}\n\nÖneriler:\n${fullAnalysis.suggestions?.join('\n\n')}` 
          : aiInterpretation,
        clarity: fullAnalysis?.clarity || 5,
        // Rüya netliğini varsayılan değer 3 olarak ayarla (duygu yoğunluğu bölümü kaldırıldığı için)
        dreamClarity: 3,
        elements: {
          ...prev.elements,
          symbols,
        },
        // Arketipleri tags alanına ekle (projede arketipler tags olarak adlandırılıyor)
        tags: currentArchetypes.length > 0 ? currentArchetypes : (archetypes || []),
        // Temaları themes alanına ekle - arketiplerden farklı
        themes,
        isLucid: fullAnalysis?.isLucid || false
      }));
    }
  }, [visible, archetypes, dreamContent, aiInterpretation, fullAnalysis]);
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Tarihi ve duyguları kontrol et
    if (!formData.date) newErrors.date = 'Rüya tarihi gerekli';
    if (formData.emotions.duringDream.length === 0)
      newErrors.emotions = 'En az bir duygu seçilmeli';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(1, prev + 1));
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        // Son arketip verilerini önce senkron, sonra gerekirse asenkron olarak al
        let currentArchetypes = getStoredArchetypes();
        if (currentArchetypes.length === 0) {
          // Bellekte yoksa, AsyncStorage'dan yüklemeyi dene
          currentArchetypes = await getStoredArchetypesAsync();
        }
        
        console.log('Kaydetme öncesi arketipler:', currentArchetypes);
        
        // Tags alanı için en güvenilir kaynağı seç
        const finalArchetypes = currentArchetypes.length > 0 
                           ? currentArchetypes 
                           : (archetypes.length > 0 
                              ? archetypes 
                              : (fullAnalysis?.archetypes || []));
        
        // Eğer arketip hala bulunamadıysa, son bir kontrol daha yap
        if (finalArchetypes.length === 0 && formData.tags && formData.tags.length > 0) {
          console.log('Form verilerinden arketip alınıyor:', formData.tags);
        }
        
        const newDream = {
          ...formData,
          tags: finalArchetypes.length > 0 ? finalArchetypes : formData.tags, // Arketip verilerini garantili şekilde ekle
          updatedAt: new Date(),
        };
        
        // Debug: Arketipleri kontrol et
        console.log('Rüya kaydedilirken arketipler:', newDream.tags);
        
        // DreamStorageService'i kullanarak rüyayı kaydet
        await saveDream(newDream);

        // Başarıyla kaydedildi modalını göster
        setShowSuccessModal(true);
        
        // Arketipleri tekrar depolamaya çalış (sonraki kullanımlarda hazır olsun)
        if (newDream.tags && newDream.tags.length > 0) {
          await archetypeStore.setArchetypes(newDream.tags);
        }
        
      } catch (error) {
        // Hata mesajı göster
        alert('Rüya kaydedilirken bir hata oluştu');
        console.error('Save error:', error);
      }
    }
  };
  
  // Arşiv sayfasına git
  const goToArchive = () => {
    // Önce modalları kapat
    setShowSuccessModal(false);
    onClose();
    
    // Sonra arşiv sayfasına yönlendir (daha güvenilir olması için biraz bekleyelim)
    setTimeout(() => {
      router.push('/dream/archive');
    }, 500);
    
    // Kullanıcı arşive gittiğinde callback'i çalıştır (mesajları sıfırla)
    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  const handleFormUpdate = (updates: Partial<DreamRecord>) => {
    // Form güncellenirken arketip bilgisinin kaybolmamasını sağla
    setFormData((prev) => {
      const newData = {
        ...prev,
        ...updates,
      };
      
      // Eğer tags güncellenmişse ve arketip içeriyorsa, onları koru
      if (archetypes.length > 0 && (!newData.tags || newData.tags.length === 0)) {
        newData.tags = archetypes;
      }
      
      return newData;
    });
  };

  const renderFormStep = () => {
    const commonProps = {
      formData,
      onUpdate: handleFormUpdate,
      errors,
    };

    const steps = [
      <BasicDreamInfo key="basic" {...commonProps} />,
      <EmotionalComponents key="emotional" {...commonProps} />,
    ];

    return (
      <Animatable.View
        animation={currentStep > 0 ? 'slideInRight' : 'slideInLeft'}
        duration={300}
        style={styles.formContainer}
      >
        <LinearGradient
          colors={['rgba(18, 18, 32, 0.98)', 'rgba(30, 30, 45, 0.98)']}
          style={styles.formGradient}
        >
          {steps[currentStep]}
        </LinearGradient>
      </Animatable.View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View style={styles.modalOverlay}>
        <Animatable.View 
          animation="slideInUp"
          duration={300}
          style={styles.modalContainer}
        >
          <DreamFormHeader
            step={currentStep}
            totalSteps={2}
            onClose={onClose}
          />

          {renderFormStep()}

          <DreamFormFooter
            step={currentStep}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSave}
            isLastStep={currentStep === 1}
          />
        </Animatable.View>
      </View>
      
      <DreamSaveAlert
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
          
          // Yeni rüya anlat butonuna tıklandığında da sohbeti sıfırla
          if (onSaveComplete) {
            onSaveComplete();
          }
        }}
        onGoToArchive={goToArchive}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    height: '92%',
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  headerGradient: {
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: theme.spacing.md,
    top: theme.spacing.md,
    zIndex: 10,
    padding: theme.spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: 'white',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  formContainer: {
    flex: 1,
  },
  formGradient: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: theme.colors.surface,
  },
  footerButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
    minWidth: 120,
  },
  footerButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default DreamSaveModal;