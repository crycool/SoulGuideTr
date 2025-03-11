import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../theme';

interface DreamSaveSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onGoToArchive: () => void;
}

const DreamSaveSuccessModal: React.FC<DreamSaveSuccessModalProps> = ({
  visible,
  onClose,
  onGoToArchive
}) => {
  // Modal görünür olduğunda 1.5 saniye sonra otomatik olarak arşive yönlendir
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onGoToArchive();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onGoToArchive]);
  
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animatable.View 
          animation="zoomIn"
          duration={400}
          style={styles.modalContainer}
        >
          <LinearGradient
            colors={['rgba(52, 152, 219, 0.95)', 'rgba(155, 89, 182, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Animatable.View 
              animation="bounceIn" 
              delay={300} 
              duration={800}
              style={styles.iconContainer}
            >
              <MaterialCommunityIcons name="check-circle" size={60} color="#fff" />
            </Animatable.View>
            
            <Animatable.Text 
              animation="fadeIn" 
              delay={500} 
              style={styles.title}
            >
              Başarıyla Kaydedildi!
            </Animatable.Text>
            
            <Animatable.Text 
              animation="fadeIn" 
              delay={700} 
              style={styles.message}
            >
              Rüyanız arşivlendi ve analizler için kullanıma hazır.
            </Animatable.Text>
            
            <Animatable.View 
              animation="fadeIn" 
              delay={1000} 
              style={styles.buttonsContainer}
            >
              <TouchableOpacity
                style={[styles.button, styles.archiveButton]}
                onPress={onGoToArchive}
              >
                <MaterialCommunityIcons name="book-open-variant" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Arşive Git</Text>
              </TouchableOpacity>
            </Animatable.View>
          </LinearGradient>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  gradientContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#fff',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.typography.fontSize.md,
    color: '#fff',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    opacity: 0.9,
  },
  buttonsContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  archiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: theme.typography.fontSize.md,
    opacity: 0.8,
  },
});

export default DreamSaveSuccessModal;