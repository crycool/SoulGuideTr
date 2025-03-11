import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  isAnalyzing?: boolean;
}

export type ChatInputRef = {
  restoreMessage: (message: string) => void;
};

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>((props, ref) => {
  const { onSend, isLoading, isAnalyzing } = props;
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Dışarıdan erişilebilir metodları tanımla
  useImperativeHandle(ref, () => ({
    restoreMessage: (text: string) => {
      setMessage(text);
    }
  }));

  // Klavye yüksekliği dinleyicilerini kaldırıyoruz, artık KeyboardAvoidingView bu işi yapacak
  // ve sadece input alanını yükseltecek, navigasyon barı etkilenmeyecek

  useEffect(() => {
    if (isAnalyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isAnalyzing, pulseAnim]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      setInputHeight(40);
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.micButton,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        {isAnalyzing ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Ionicons 
            name={isLoading ? "hourglass" : "mic"} 
            size={24} 
            color={theme.colors.secondary} 
          />
        )}
      </Animated.View>

      <TextInput
        style={[
          styles.input,
          { height: Math.max(40, inputHeight) },
          (isLoading || isAnalyzing) && styles.inputDisabled
        ]}
        placeholder="Rüyanı bana anlat..."
        placeholderTextColor="rgba(255,255,255,0.5)"
        value={message}
        onChangeText={setMessage}
        multiline
        editable={!isLoading && !isAnalyzing}
        onContentSizeChange={(event) => {
          setInputHeight(event.nativeEvent.contentSize.height);
        }}
      />

      <TouchableOpacity
        style={[
          styles.sendButton,
          (!message.trim() || isLoading) && styles.sendButtonDisabled
        ]}
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
        ) : (
          <Ionicons
            name="send"
            size={24}
            color={message.trim() ? theme.colors.primary : "rgba(241, 196, 15, 0.5)"}
          />
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    // Absolute pozisyonlama kaldırıldı, böylece klavye davranışını etkilemez
    width: '100%',
    paddingBottom: Platform.OS === 'android' ? theme.spacing.md : theme.spacing.sm,
    ...theme.shadows.md,
  },
  input: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.full,
    color: theme.colors.text,
    maxHeight: 100,
    fontSize: theme.typography.fontSize.md,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(241, 196, 15, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatInput;