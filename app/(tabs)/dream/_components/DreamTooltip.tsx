import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../theme';

interface DreamTooltipProps {
  visible: boolean;
  onClose: () => void;
  autoCloseTime?: number;
}

const { width } = Dimensions.get('window');

const DreamTooltip: React.FC<DreamTooltipProps> = ({
  visible,
  onClose,
  autoCloseTime = 4000
}) => {
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [visible, autoCloseTime, onClose]);
  
  if (!visible) return null;
  
  return (
    <Animatable.View 
      animation="fadeIn"
      duration={400}
      style={styles.tooltipContainer}
    >
      <LinearGradient
        colors={['rgba(74, 20, 140, 0.95)', 'rgba(114, 70, 180, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <MaterialCommunityIcons name="gesture-tap-hold" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>İpucu</Text>
            <Text style={styles.message}>Rüyayı silmek için ilgili karta uzun basın.</Text>
          </View>
        </View>
        
        <View style={styles.arrowContainer}>
          <View style={styles.arrow} />
        </View>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MaterialCommunityIcons name="close" size={16} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </LinearGradient>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    top: 70,
    right: 20,
    zIndex: 9999,
    width: width * 0.8,
    maxWidth: 300,
    elevation: 10,
  },
  gradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 2,
  },
  message: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 18,
  },
  arrowContainer: {
    position: 'absolute',
    top: -10,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(74, 20, 140, 0.95)',
    transform: [{ rotate: '180deg' }],
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DreamTooltip;