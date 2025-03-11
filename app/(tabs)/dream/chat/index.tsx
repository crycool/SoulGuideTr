import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../theme';
import dreamPrompts from '../_utils/chatPrompts';

// Performans optimizasyonu için lazy loading kullan
const ChatInput = lazy(() => import('../_components/ChatInput'));
const ChatBubble = lazy(() => import('../_components/ChatBubble'));
const ChatHeader = lazy(() => import('../_components/ChatHeader'));
const LoadingCard = lazy(() => import('../_components/LoadingCard'));

// Servisleri asenkron olarak yükle
const dreamAnalysisService = import('../_services/dreamAnalysisService')
  .then(module => module.getDreamAnalysisService);
const insightStorageService = import('../insights/_services/insightStorage')
  .then(module => module.updateInsightsOnNewDream);

// LazyComponent'i forwardRef kullanarak yeniden tanımlama
const LazyComponent = React.forwardRef(({ component: Component, ...props }, ref) => (
  <Suspense fallback={<View style={{ minHeight: 50 }}><ActivityIndicator size="small" color="#f1c40f" /></View>}>
    <Component ref={ref} {...props} />
  </Suspense>
));

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  isInterpretation?: boolean;
  originalContent?: string;
  fullAnalysis?: any;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingSteps, setLoadingSteps] = useState<Array<{text: string, done: boolean}>>([]);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const ChatInputRef = useRef<any>(null);

  // Ekrandan ayrılıp geri dönüldüğünde chat geçmişini temizle ve karşılama mesajını göster
  useFocusEffect(
    React.useCallback(() => {
      // Ekrana odaklanıldığında çalışacak
      const welcomeMessage: Message = {
        id: 'welcome',
        text: dreamPrompts.INITIAL_GREETING,
        isAI: true,
        isInterpretation: false,
      };
      setMessages([welcomeMessage]);
      
      // Sayfa yüklendiğinde en üste scroll yap
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }, 100);
      
      return () => {
        // Ekrandan ayrılırken çalışacak (opsiyonel)
      };
    }, [])
  );
  
  // Kullanıcı yazınca karşılama mesajını kaldır ve kullanıcı mesajını göster
  const handleSendMessage = async (text: string) => {
    // Güncel mesajları al
    const currentMessages = [...messages];
    
    // Eğer bu karşılama mesajı ise kaldır
    const filteredMessages = currentMessages.filter(msg => msg.id !== 'welcome');
    
    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isAI: false,
    };
    setMessages([...filteredMessages, userMessage]);
    scrollToBottom();

    // Yükleme adımlarını ayarla
    setLoadingSteps([
      { text: 'Rüya sembolleri analiz ediliyor...', done: false },
      { text: 'Duygusal içerikler inceleniyor...', done: false },
      { text: 'Arketipler ve temalar belirleniyor...', done: false },
      { text: 'Jung psikolojisi perspektifinden yorumlanıyor...', done: false },
      { text: 'Detaylı rüya analizi oluşturuluyor...', done: false },
    ]);
    setCurrentLoadingStep(0);
    
    // İLK ADIM: Rüya sembolleri analiz ediliyor (daha hızlı - 700ms)
    setTimeout(() => {
      setLoadingSteps(steps => steps.map((step, i) => 
        i === 0 ? { ...step, done: true } : step
      ));
      setCurrentLoadingStep(1);
    }, 700);

    try {
      // İKİNCİ ADIM: Duygusal içerikler inceleniyor (daha hızlı - 600ms sonra)
      setTimeout(() => {
        setLoadingSteps(steps => steps.map((step, i) => 
          i === 1 ? { ...step, done: true } : step
        ));
        setCurrentLoadingStep(2);
      }, 1300); // İlk adımdan 600ms sonra
      
      // ÜÇÜNCÜ ADIM: Arketipler ve temalar belirleniyor (daha hızlı - 500ms sonra)
      setTimeout(() => {
        setLoadingSteps(steps => steps.map((step, i) => 
          i === 2 ? { ...step, done: true } : step
        ));
        setCurrentLoadingStep(3);
      }, 1800); // İkinci adımdan 500ms sonra
      
      // DÖRDÜNCÜ ADIM: Jung psikolojisi perspektifinden yorumlanıyor (daha hızlı - 800ms sonra)
      setTimeout(() => {
        setLoadingSteps(steps => steps.map((step, i) => 
          i === 3 ? { ...step, done: true } : step
        ));
        setCurrentLoadingStep(4);
      }, 2600); // Üçüncü adımdan 800ms sonra
      
      // API isteği başlat (bu sırada beşinci adım gösteriliyor olacak)
      const analysisService = await dreamAnalysisService;
      const analysis = await analysisService.analyzeDream(text);
      
      // SON ADIM İÇİN DAHA UZUN BEKLE: Detaylı rüya analizi oluşturuluyor
      // API yanıtı alındı, ama son adımı daha uzun sürede tamamla
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // BEŞİNCİ ADIM: Son adımı tamamla
      setLoadingSteps(steps => steps.map(step => ({ ...step, done: true })));
      
      // Mesajı göstermeden önce daha uzun bir gecikme (800ms)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // AI mesajını ekle ve yorumlama olduğunu belirt
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `**Ana Tema:** ${analysis.mainTheme}\n\n${analysis.insights[0]}\n\nDaha detaylı analizler ve öneriler için rüyanızı kaydetmeyi unutmayın!`,
        isAI: true,
        isInterpretation: true,
        originalContent: text,
        fullAnalysis: analysis
      };
      const updatedMessages = [...filteredMessages, userMessage, aiMessage];
      setMessages(updatedMessages);
      
      // Yanıt geldiğinde sayfayı en üste kaydır
      setTimeout(() => {
        scrollToTop();
      }, 200);
      
      // Rüya yorumlandığında içgörüleri güncelle
      // Not: Hata olsa bile güncellemeyi dene, ana işlemin başarısını etkilemez
      try {
        const updateInsights = await insightStorageService;
        updateInsights()
          .then(() => console.log('İçgörüler güncellendi'))
          .catch(err => console.warn('İçgörü güncelleme hatası (önemsiz):', err));
      } catch (insightError) {
        console.warn('İçgörü güncelleme hatası (önemsiz):', insightError);
      }
    } catch (error) {
      console.error('Error getting dream interpretation:', error);
      // Hata mesajını ekle
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Rüyanızı yorumlarken bir hata oluştu. Lütfen tekrar deneyin.',
        isAI: true,
        isInterpretation: false,
      };
      setMessages([...filteredMessages, userMessage, errorMessage]);
      
      // Hata durumunda kullanıcının mesajını ChatInput alanına geri getir
      if (ChatInputRef.current) {
        ChatInputRef.current.restoreMessage(text);
      }
    } finally {
      // Yükleme adımlarını sıfırla (kısa bir gecikmeyle)
      setTimeout(() => {
        setLoadingSteps([]);
        setCurrentLoadingStep(0);
      }, 300);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Sayfayı en üste kaydır (yukarda bir mesaj varsa)
  const scrollToTop = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 100);
  };

  // Mesajlar değiştiğinde kontrol et
  useEffect(() => {
    // Eğer mesajlarda yorumlama var, sayfa yüklendiğinde başa scroll yap
    if (messages.some(msg => msg.isInterpretation)) {
      scrollToTop();
    }
  }, [messages]);

  // Klavye ile ilgili scroll davranışı sadece messagesContainer için olmalı
  // Input alanı yerine sadece mesajların kaydırılması için scroll fonksiyonları düzenlendi
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        // Yeni metinler için klavye açıldığında mesajları aşağı kaydır
        // böylece kullanıcılar son yazanı mesajlarını görebilir
        if (!messages.some(msg => msg.isInterpretation)) {
          scrollToBottom();
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* KeyboardAvoidingView yerine View kullanıyoruz, navigasyon barının hareketini önlemek için */}
      <LazyComponent component={ChatHeader} />
      <LinearGradient
        colors={[
          'rgba(18, 18, 32, 0.97)', 
          'rgba(30, 30, 45, 0.95)', 
          'rgba(18, 18, 32, 0.97)'
        ]}
        style={{flex: 1}}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
          onContentSizeChange={() => {
            // İçerik boyutu değiştiğinde yorumlama varsa yukarı kaydır
            if (messages.some(msg => msg.isInterpretation)) {
              scrollToTop();
            }
          }}
        >
          {messages.map((message) => (
            <LazyComponent
              component={ChatBubble}
              key={message.id}
              message={message.text}
              isAI={message.isAI}
              isInterpretation={message.isInterpretation}
              onSaveComplete={() => {
                // Kaydetme işlemi tamamlandığında karşılama mesajına geri dön
                const welcomeMessage: Message = {
                  id: 'welcome',
                  text: dreamPrompts.INITIAL_GREETING,
                  isAI: true,
                  isInterpretation: false,
                };
                setMessages([welcomeMessage]);
              }} 
              originalContent={message.originalContent}
              fullAnalysis={message.fullAnalysis}
            />
          ))}
          
          {/* Yükleme adımları gösterim kartı */}
          {loadingSteps.length > 0 && (
            <LazyComponent 
              component={LoadingCard}
              steps={loadingSteps}
              currentStep={currentLoadingStep}
            />
          )}
        </ScrollView>
      </LinearGradient>
      
      {/* ChatInput için KeyboardAvoidingView kullanıyoruz, sadece input alanı için */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.inputContainer}
      >
        <LazyComponent 
          component={ChatInput}
          ref={ChatInputRef}
          onSend={handleSendMessage} 
          isLoading={loadingSteps.length > 0} 
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 32, 0.9)',
  },
  messagesContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 3, // Ekstra padding, metin kutusu için daha fazla alan
    minHeight: '100%',
  },
  // Input container için yeni stil
  inputContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
});