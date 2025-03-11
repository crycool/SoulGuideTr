import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../theme';

interface ArchiveHeaderProps {
  onFilterPress: () => void;
  onRefresh: () => void;
}

const ArchiveHeader: React.FC<ArchiveHeaderProps> = ({ onFilterPress, onRefresh }) => {
  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity onPress={onRefresh} style={styles.headerButton}>
        <Feather name="refresh-cw" size={20} color="#f1c40f" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFilterPress} style={styles.headerButton}>
        <Feather name="filter" size={20} color="#f1c40f" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: theme.spacing.md,
    padding: theme.spacing.xs,
  },
});

export default ArchiveHeader;