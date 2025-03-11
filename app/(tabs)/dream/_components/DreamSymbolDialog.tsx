import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DreamSymbolDialogProps {
  visible: boolean;
  symbol: string;
  onClose: () => void;
}

const DreamSymbolDialog: React.FC<DreamSymbolDialogProps> = ({ visible, symbol, onClose }) => {
  const router = useRouter();

  // Sembolü içeren rüyaları görüntülemek için arşiv sayfasına yönlendir
  const goToSymbolDreams = () => {
    onClose();
    // Sembole göre filtrelenmiş arşiv sayfasına yönlendir
    router.push({
      pathname: '/(tabs)/dream/archive',
      params: { symbolFilter: symbol }
    });
  };

  // Sembol anlamını görüntüle (ileride API veya veritabanından alınabilir)
  const showSymbolMeaning = () => {
    onClose();
    // Burada sembol anlamı modalı veya sayfası açılabilir
    // Şimdilik basit bir yönlendirme yapalım
    router.push({
      pathname: '/(tabs)/dream/symbol-info',
      params: { symbol }
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>"{symbol}" Sembolü</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalText}>Bu sembol hakkında ne yapmak istersiniz?</Text>

          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: '#3498db' }]} 
            onPress={showSymbolMeaning}
          >
            <Ionicons name="book-outline" size={22} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sembolün Anlamını Göster</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: '#9b59b6' }]} 
            onPress={goToSymbolDreams}
          >
            <Ionicons name="list-outline" size={22} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sembollü Rüyalarımı Göster</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1e1e2d',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  closeButton: {
    padding: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#ecf0f1',
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DreamSymbolDialog;
