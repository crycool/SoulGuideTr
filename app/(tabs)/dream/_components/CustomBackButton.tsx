import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';

interface CustomBackButtonProps {
  color?: string;
  style?: object;
}

/**
 * Özel Geri Butonu Bileşeni
 * Bu bileşen, standart header'ın geri tuşu çalışmadığında kullanılabilir
 */
const CustomBackButton: React.FC<CustomBackButtonProps> = ({ color = theme.colors.primary, style = {} }) => {
  const router = useRouter();
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        onPress={handleGoBack}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={color} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  button: {
    padding: 8,
  },
});

export default CustomBackButton;
