import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../../theme';

interface DeleteHintTooltipProps {
  onClose: () => void;
  onNeverShowAgain: () => void;
  autoCloseTime?: number;
}

const DeleteHintTooltip: React.FC<DeleteHintTooltipProps> = ({
  onClose,
  onNeverShowAgain,
  autoCloseTime = 5000
}) => {
  useEffect(() => {
    console.log("DeleteHintTooltip mounted");
    const timer = setTimeout(() => {
      console.log("Tooltip autoclosing");
      onClose();
    }, autoCloseTime);
    
    return () => {
      console.log("DeleteHintTooltip unmounting, clearing timer");
      clearTimeout(timer);
    };
  }, [autoCloseTime, onClose]);
  
  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="bounceIn"
        duration={800}
        style={styles.tooltipContainer}
      >
          <LinearGradient
            colors={['rgba(142, 68, 173, 0.9)', 'rgba(91, 49, 147, 0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="gesture-tap-hold" size={32} color="#fff" />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>Rüya Silme İpucu</Text>
              <Text style={styles.message}>
                Herhangi bir rüyayı silmek için karta <Text style={styles.highlight}>uzun basın</Text>.
              </Text>
              
              <TouchableOpacity 
                style={styles.neverShowButton}
                onPress={onNeverShowAgain}
              >
                <Text style={styles.neverShowText}>Bir daha gösterme</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>
      </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
    pointerEvents: 'box-none',
  },
  tooltipContainer: {
    width: width * 0.85,
    maxWidth: 340,
    zIndex: 10000,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#fff',
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: theme.typography.fontWeight.bold,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  neverShowButton: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  neverShowText: {
    fontSize: theme.typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default DeleteHintTooltip;