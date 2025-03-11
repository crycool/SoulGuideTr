import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../theme';

interface DreamSaveAlertProps {
  visible: boolean;
  onClose: () => void;
  onGoToArchive: () => void;
}

const DreamSaveAlert: React.FC<DreamSaveAlertProps> = ({
  visible,
  onClose,
  onGoToArchive
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animatable.View 
          animation="bounceIn"
          duration={500}
          style={styles.modalContainer}
        >
          <LinearGradient
            colors={['rgba(52, 152, 219, 0.95)', 'rgba(155, 89, 182, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Animatable.View 
              animation="pulse" 
              iterationCount="infinite"
              duration={2000}
              style={styles.iconContainer}
            >
              <MaterialCommunityIcons name="check-circle" size={60} color="#fff" />
            </Animatable.View>
            
            <Text style={styles.title}>
              Rüyanız Kaydedildi!
            </Text>
            
            <Text style={styles.message}>
              Rüyanız başarıyla arşivlendi ve analizlerinizde kullanılacak. İçgörülerinizi keşfetmek için arşive gidebilirsiniz.
            </Text>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.archiveButton]}
                onPress={onGoToArchive}
              >
                <MaterialCommunityIcons name="book-open-variant" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Arşive Git</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.newDreamButton]}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="star-plus-outline" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Yeni Rüya Anlat</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
    lineHeight: 22,
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
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  archiveButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.8)',
    flexDirection: 'row',
  },
  newDreamButton: {
    backgroundColor: 'rgba(241, 196, 15, 0.6)',
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

});

export default DreamSaveAlert;