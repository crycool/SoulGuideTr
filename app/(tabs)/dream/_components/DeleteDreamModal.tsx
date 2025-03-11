import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../theme';

interface DeleteDreamModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dreamTitle: string;
}

const DeleteDreamModal: React.FC<DeleteDreamModalProps> = ({
  visible,
  onClose,
  onConfirm,
  dreamTitle
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animatable.View 
          animation="zoomIn"
          duration={300}
          style={styles.modalContainer}
        >
          <LinearGradient
            colors={['rgba(211, 84, 0, 0.95)', 'rgba(192, 57, 43, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="trash-can-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.title}>Rüyayı Sil</Text>
          </LinearGradient>

          <View style={styles.contentContainer}>
            <Text style={styles.message}>
              <Text style={styles.dreamTitle}>"{dreamTitle}"</Text> isimli rüyayı silmek istediğinize emin misiniz?
            </Text>
            
            <Text style={styles.warningText}>
              Bu işlem geri alınamaz!
            </Text>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>VAZGEÇ</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={onConfirm}
              >
                <MaterialCommunityIcons name="trash-can" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>SİL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  gradientHeader: {
    padding: theme.spacing.md,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  message: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  dreamTitle: {
    fontWeight: theme.typography.fontWeight.bold,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(231, 76, 60, 1.0)',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontWeight: theme.typography.fontWeight.medium,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: 'rgba(52, 73, 94, 0.9)',
  },
  confirmButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default DeleteDreamModal;