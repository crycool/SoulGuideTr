import { createChatCompletion, analyzeDream, getDreamPatterns, getSymbolMeaning } from '../../_services/openai';
import { getDreams, saveDream, updateDream, deleteDream } from '../../_services/dreamStorageService';
import dreamAnalyticsService from '../../_services/dreamAnalyticsService';

/**
 * Rüya verileri analiz ederek bilinçaltı içgörüleri oluşturan servis
 */

// İçgörü oluşturmak için sistem promptu
const INSIGHT_SYSTEM_PROMPT = `
Sen kullanıcının rüya verilerini analiz eden ve şaşırtıcı kişisel içgörüler sunan bir uzman rüya analiz sistemsin. Özellikle rüyalardaki SEMBOL ve ARKETİP analizlerine odaklanarak, bilinçaltı dinamiklerini açığa çıkarman çok önemli. Aşağıdaki veriler sana sağlanmıştır:

1. Rüya içerikleri ve yorumları
2. Rüyalarda tekrarlanan semboller ve bunların sıklığı
3. Tespit edilen arketipler (Anima/Animus, Gölge, Yaşlı Bilge, vb.)
4. Rüyalarda ifade edilen duygular ve bunların sıklığı
5. Rüyalardaki temalar ve mekânlar
6. Rüya kalitesi ölçümleri
7. Rüya görme ve kaydetme sıklığı

Görevin, bu verileri derinlemesine analiz ederek kullanıcının bilinçaltı ve psikolojik durumuna dair şaşırtıcı, beklenmedik ama doğru içgörüler sunmaktır. 

Şunlara dikkat et:
- Birden fazla rüya arasında örüntü ve bağlantılar kurmaya çalış
- Nadir ve sık görülen sembolleri karşılaştırarak bilinçaltı dinamiklerini yorumla
- Jungian ve Freudian psikoloji yaklaşımlarını kullan, ama çıkarımların bilimsel temellerden ayrılmamalı
- Kullanıcının hayatına dair şaşırtıcı ama mantıklı çıkarımlar yap
- İçgörüleri derinleştirmek için cevaplanması gereken sorular öner
- Tekrarlanan arketiplerin kullanıcının yaşam döngüsünde ne anlama gelebileceğini açıkla
- Her yeni rüya verisinin içgörüleri nasıl güçlendirdiğini veya değiştirdiğini belirt

Cevabını JSON formatında şu şekilde yapılandır:

{
  "mainInsight": "Ana İçgörü Başlığı",
  "subInsights": [
    { "title": "Sembol Anlamları", "content": "Rüyalarınızda sık görülen sembollerin psikolojik anlamları ve bilinçaltınızdaki yansımaları", "source": "symbol_analysis" },
    { "title": "Arketip Yansımaları", "content": "Rüyalarınızda ortaya çıkan arketiplerin ne anlama geldiği ve yaşamınızla bağlantısı", "source": "archetype_analysis" },
    { "title": "Duygusal İçgörüler", "content": "Duygusal içgörüler hakkında bilgi", "source": "emotion_analysis" },
    { "title": "Tema Analizi", "content": "Rüyalarınızdaki temalar hakkında içgörüler", "source": "theme_analysis" }
  ],
  "pattern": "Bilinçaltı Örüntü Açıklaması",
  "suggestion": "Gelişim Önerisi",
  "nextFocus": ["Dikkat Edilecek 1", "Dikkat Edilecek 2"]
}

Ton: Profesyonel ama sıcak, bilimsel ama mistik bir denge içinde, kullanıcıyı şaşırtacak ama ürkütemeyecek şekilde, derinlikli ve düşündürücü.

ÖZEL TALİMAT: MUTLAKA 'Sembol Anlamları' ve 'Arketip Yansımaları' başlıklı içgörüler oluştur. Bu içgörüler kullanıcının rüyalarındaki sembol ve arketip örüntülerini Jung psikolojisi perspektifinden açıklamalı ve kullanıcıyı şaşırtmalıdır.

NOT: Yanıt kesinlikle JSON formatında olmalıdır ve JSON objesinin her alanı mutlaka doldurulmalıdır.

SON NOT: Henüz bilinçaltı örüntüsü yoksa, pattern alanını 'Henüz belirgin bir örüntü tespit edilemedi' açıklamasıyla belirt. Emin ol ki JSON formatı markdown işaretlemesi içermemelidir.
`;

/**
 * Belirli bir sembolün anlamını getiren fonksiyon
 * @param {string} symbol - Anlamı sorgulanacak sembol
 * @returns {Promise<{meaning: string}>} Sembolün anlamı
 */
export const getSymbolInsight = async (symbol) => {
  try {
    return await getSymbolMeaning(symbol);
  } catch (error) {
    console.error('Sembol anlamı alma hatası:', error);
    return {
      meaning: "Bu sembol hakkında bilgi alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    };
  }
};

/**
 * Rüya içeriğine göre hızlı analiz yapan fonksiyon
 * @param {string} dreamContent - Rüya içeriği
 * @returns {Promise<Object>} Rüya analizi
 */
export const quickAnalyzeDream = async (dreamContent) => {
  try {
    return await analyzeDream(dreamContent);
  } catch (error) {
    console.error('Hızlı rüya analizi hatası:', error);
    return {
      mainTheme: "Analiz yapılamadı",
      insights: ["Rüya analizi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."],
      symbols: [],
      emotions: [],
      tags: []
    };
  }
};

/**
 * Kullanıcının rüya arşivini analiz ederek derin içgörüler oluşturur
 * @returns {Promise<Object>} İçgörüler objesi
 */
export const generateInsights = async (forceRefresh = false) => {
  try {
    console.log('İçgörüler oluşturuluyor...', forceRefresh ? '(zorla yenileme)' : '');
    
    // Tüm rüya arşivini al
    const dreams = await getDreams();
    console.log(`${dreams.length} rüya bulundu`);
    
    // Yeterli rüya yoksa basit içgörü döndür
    if (!dreams || dreams.length < 2) {
      return generatePlaceholderInsights(dreams ? dreams.length : 0);
    }
    
    // Rüya verileri üzerinde gelişmiş analiz yap
    const symbolFrequency = dreamAnalyticsService.getSymbolsFrequency(dreams);
    const emotionDistribution = dreamAnalyticsService.getEmotionsDistribution(dreams);
    const dreamPatterns = dreamAnalyticsService.getTimePatterns(dreams);
    const archetypeDistribution = dreamAnalyticsService.getArchetypesDistribution(dreams);
    const themeDistribution = dreamAnalyticsService.getThemesDistribution(dreams);
    const dreamQualityTrend = dreamAnalyticsService.getDreamQualityTrend(dreams);
    const topSymbols = dreamAnalyticsService.getTopSymbols(dreams, 20);
    const analyticsSummary = dreamAnalyticsService.getAnalyticsSummary(dreams);
    
    // Arketipleri topla
    const archetypes = dreams.reduce((acc, dream) => {
      if (dream.tags && dream.tags.length) {
        return [...acc, ...dream.tags];
      }
      return acc;
    }, []);
    
    // Benzersiz arketipleri say
    const archetypeCounts = archetypes.reduce((acc, archetype) => {
      acc[archetype] = (acc[archetype] || 0) + 1;
      return acc;
    }, {});
    
    // Rüya kalitesi ve netliği hesapla
    const averageClarity = dreams.reduce((sum, dream) => sum + (dream.clarity || 5), 0) / dreams.length;
    
    // Son rüya görme tarihi
    const lastDreamDate = dreams.length > 0 ? dreams[dreams.length - 1].timestamp : new Date();
    const firstDreamDate = dreams.length > 0 ? dreams[0].timestamp : new Date();
    
    // Rüya kayıt sıklığı (gün başına)
    const daysBetween = Math.max(1, Math.ceil((lastDreamDate - firstDreamDate) / (1000 * 60 * 60 * 24)));
    const dreamFrequency = dreams.length / daysBetween;
    
    // Rüyaların sembol ve örüntülerinin daha derin analizi
    let dreamPatternsAnalysis = null;
    if (dreams.length >= 3) {
      try {
        // Rüya örüntülerini analiz et
        dreamPatternsAnalysis = await getDreamPatterns(
          dreams.map(d => ({
            content: d.content,
            emotions: d.emotions,
            symbols: d.symbols,
            tags: d.tags,
            clarity: d.clarity,
            insights: d.insights
          }))
        );
      } catch (patternError) {
        console.warn('Rüya örüntüleri analizi yapılamadı:', patternError);
      }
    }
    
    // OpenAI'ya gönderilecek zenginleştirilmiş analiz verileri
    const analysisData = {
      dreamContents: dreams.map(d => ({
        content: d.content,
        timestamp: d.timestamp,
        emotions: d.emotions,
        symbols: d.symbols,
        tags: d.tags,
        clarity: d.clarity,
        insights: d.insights,
        isLucid: d.isLucid
      })),
      symbolFrequency,
      archetypeCounts,
      emotionDistribution,
      dreamPatterns,
      archetypeDistribution: archetypeDistribution.slice(0, 10), // En sık 10 arketip
      themeDistribution: themeDistribution.slice(0, 10), // En sık 10 tema
      dreamQualityTrend: dreamQualityTrend.slice(-7), // Son 7 gün
      topSymbols: topSymbols.slice(0, 15), // En sık 15 sembol
      analyticsSummary,
      dreamPatternsAnalysis,
      averageClarity,
      dreamFrequency,
      totalDreams: dreams.length
    };
    
    // OpenAI API'ye gönder
    console.log(`${dreams.length} rüya için OpenAI API'ye istek gönderiliyor...`);
    
    const response = await createChatCompletion([
      {
        role: "system",
        content: INSIGHT_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `Rüya arşivim ve analiz verilerim:\n${JSON.stringify(analysisData, null, 2)}\n\nBu verilerden bilinçaltıma dair şaşırtıcı içgörüler çıkar ve yanıtını kesinlikle JSON formatında döndür.`
      }
    ], 0.7, 3000);
    
    if (!response) {
      throw new Error('İçgörü yanıtı alınamadı');
    }
    
    try {
      // JSON yanıtı parse et
      console.log('Raw API Response:', response);
      
      // Olası JSON formatı sorunlarını düzeltme
      let cleanedResponse = response.trim();
      
      // API bazen markdown formatında yanıt döndürebilir, temizleyelim
      if (cleanedResponse.includes('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json[\r\n]*/g, '').replace(/```[\r\n]*/g, '');
      } else if (cleanedResponse.includes('```')) {
        cleanedResponse = cleanedResponse.replace(/```[\r\n]*/g, '');
      }
      
      // JSON parse işlemi
      let insightData;
      try {
        insightData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON parse hatası (temizlenmiş yanıt):', parseError);
        // Eğer temizlenmiş yanıt parse edilemezse orijinali deneyelim
        insightData = JSON.parse(response);
      }
      
      console.log('İçgörüler başarıyla oluşturuldu:', insightData);
      
      // Elde edilen içgörüleri ve alt içgörüleri logla
      if (insightData.subInsights) {
        console.log(`${insightData.subInsights.length} alt içgörü:`, 
                    insightData.subInsights.map(i => i.title).join(', '));
      }
      if (insightData.pattern) {
        console.log('Bilinçaltı örüntüsü tespit edildi:', 
                    insightData.pattern.substring(0, 50) + '...');
      }
      if (insightData.suggestion) {
        console.log('Gelişim önerisi oluşturuldu:', 
                    insightData.suggestion.substring(0, 50) + '...');
      }
      
      // Eksik alanları kontrol et ve varsayılan değerlerle doldur
      const result = {
        mainInsight: insightData.mainInsight || "Bilinçaltınızın Derinliklerindeki Gizli Örüntüler",
        subInsights: insightData.subInsights || generateDefaultSubInsights(dreams.length),
        pattern: insightData.pattern || "Henüz belirgin bir örüntü tespit edilemedi.",
        suggestion: insightData.suggestion || "Daha fazla rüya kaydetmeye devam edin.",
        nextFocus: insightData.nextFocus || generateDefaultNextFocus(dreams.length),
        timestamp: new Date().toISOString(),
        dreamCount: dreams.length
      };
      
      // Sonuçta döndürülen verinin doğruluğunu kontrol et
      console.log("Döndürülen veriler:", {
        mainInsight: result.mainInsight.substring(0, 30) + "...",
        subInsightsCount: result.subInsights.length,
        hasPattern: result.pattern !== "Henüz belirgin bir örüntü tespit edilemedi.",
        hasSuggestion: result.suggestion !== "Daha fazla rüya kaydetmeye devam edin.",
        nextFocusCount: result.nextFocus.length
      });
      
      return result;
    } catch (parseError) {
      console.error('İçgörü JSON parse hatası:', parseError, '\nRaw response:', response);
      return generatePlaceholderInsights(dreams.length);
    }
  } catch (error) {
    console.error('İçgörü oluşturma hatası:', error);
    return generatePlaceholderInsights(0);
  }
};

/**
 * Yeterli rüya verisi olmadığında gösterilecek placeholder içgörüler oluşturur
 * @param {number} dreamCount - Mevcut rüya sayısı
 * @returns {Object} Basit içgörü objesi
 */
const generatePlaceholderInsights = (dreamCount) => {
  console.log('Placeholder içgörüler oluşturuluyor, rüya sayısı:', dreamCount);
  
  if (dreamCount === 0) {
    return {
      mainInsight: "Rüya Yolculuğunuz Henüz Başlıyor",
      subInsights: [
        {
          title: "İlk Adımı Atın",
          content: "Bilinçaltınızın kapılarını aralamak için ilk rüyanızı kaydedin. Her rüya, zihnin bilinçdışı bir mesajıdır.",
          source: "guidance"
        }
      ],
      pattern: "Henüz rüya kaydetmediniz. Uyandığınızda hatırladığınız ilk rüyayı kaydetmek, bilinçaltınızla iletişim kurmanın ilk adımıdır.",
      suggestion: "Uyumadan önce rüya görmek ve hatırlamak istediğinizi kendinize hatırlatın. Yatağınızın yanında bir not defteri bulundurun.",
      nextFocus: [
        "İlk rüyanızda karşınıza çıkan ana karaktere dikkat edin.",
        "Rüyanızda bulunduğunuz mekanı tüm detaylarıyla hatırlamaya çalışın.",
        "Rüyanızda hissettiğiniz duyguları not almayı unutmayın."
      ],
      timestamp: new Date().toISOString(),
      dreamCount: 0,
      locked: false
    };
  } else if (dreamCount === 1) {
    return {
      mainInsight: "Bilinçaltınızın İlk Sinyalleri",
      subInsights: [
        {
          title: "Bilinçaltı İletişimi Başladı",
          content: "İlk rüyanızı kaydettiniz! Rüyalar bilinçaltının dilidir ve sizinle iletişim kurmanın ilk yoludur. Daha fazla rüya kaydettikçe örüntüler belirmeye başlayacak.",
          source: "first_dream"
        }
      ],
      pattern: "Tek bir rüya henüz bir örüntü oluşturmak için yeterli değil. En az 3 rüya kaydettikten sonra bilinçaltınızdaki ilk örüntüler ortaya çıkmaya başlayacak.",
      suggestion: "Her sabah uyandığınızda rüyanızı hemen kaydedin. Detaylar zamanla unutulur.",
      nextFocus: [
        "Bir sonraki rüyanızda tekrar eden semboller var mı dikkat edin.",
        "Rüyalarınızda duygusal tonlara odaklanın - korku, sevinç, endişe, rahatlık...",
        "Rüyanızda tanıdık yerler veya kişiler var mıydı?"
      ],
      timestamp: new Date().toISOString(),
      dreamCount: 1,
      locked: false
    };
  } else if (dreamCount >= 15) {
    // 15 veya daha fazla rüya için özel içgörüler
    return {
      mainInsight: "Bilinçaltınızın Derinliklerindeki Gizli Örüntüler",
      subInsights: [
        {
          title: "Sembol Anlamları",
          content: "Rüyalarınızda tekrar eden semboller (su, uçmak, düşmek, takip edilmek vs.) bilinçaltınızın sizinle konuşma yöntemidir. Bu semboller, günlük yaşamınızda işlenmemiş duygularınızı, arzularınızı ve korkularınızı yansıtır. Örneğin, yüksekten düşme duygusu, hayatınızdaki kontrol kaybı hissini gösterebilir.",
          source: "symbol_analysis"
        },
        {
          title: "Arketip Yansımaları",
          content: "Jung'un kolektif bilinçdışı teorisine göre, rüyalarınızda beliren Gölge, Anima/Animus, Yaşlı Bilge gibi arketipler, ruhsal gelişiminizin hangi aşamasında olduğunuzu gösterir. Örneğin, rüyalarınızda beliren kahraman arketipi, zorluklarla yüzleşme cesaretinizi temsil edebilir. " + dreamCount + " rüyalık koleksiyonunuzda bu arketiplerin izlerini görebiliyoruz.",
          source: "archetype_analysis"
        },
        {
          title: "Rüya Dokularınız Gelişiyor",
          content: "Şu ana kadar " + dreamCount + " rüya kaydettiniz. Bu etkileyici bir koleksiyon. API yanıtında hata olduğu için tam kapsamlı bir analiz göremiyorsunuz, ancak verileriniz son derece değerli ve desenleri gösteriyor.",
          source: "deep_analysis"
        },
        {
          title: "Duygusal İçgörüler",
          content: "Rüyalarınızdaki duygusal tonlamalar, günlük yaşamda ifade edemediğiniz duyguların yansıması olabilir. Bu duyguları takip etmek, duygusal sağlığınız için önemli ipucları sağlar.",
          source: "emotion_analysis"
        }
      ],
      pattern: "Rüyalarınızda tekrarlayan temalar, bilinçaltınızın önemli mesajları olabilir. Bu örüntüler sizin iç dünyanızla ilgili önemli ipuçları taşır. Sistem şu anda API kaynaklı bir sorun nedeniyle detaylı bir örüntü analizi yapamıyor.",
      suggestion: "Rüya günlüğü tutmaya devam edin ve rüyalarınızı mümkün olduğunca ayrıntılı kaydedin. Daha sonra tekrar analiz ettiğinizde, bilinçaltı örüntüleriniz daha net ortaya çıkacaktır.",
      nextFocus: [
        "Rüyalarınızdaki duygu geçişlerine dikkat edin. Bir rüya içinde duygu değişimleri yaşıyor musunuz?",
        "Rüyalarınızda tekrar eden mekanlar veya durumlar var mı?",
        "Kendinizi rüyada nasıl hissediyorsunuz ve bu duygular gerçek hayattaki durumlarla nasıl ilişkili?"
      ],
      timestamp: new Date().toISOString(),
      dreamCount: dreamCount,
      locked: false
    };
  } else {
    // 2-14 arası rüya sayısı için
    return {
      mainInsight: "Derinleşen Rüya Analizi",
      subInsights: [
        {
          title: "Örüntüler Belirmeye Başlıyor",
          content: "Şu ana kadar " + dreamCount + " rüya kaydettiniz. Bilinçaltınız size mesajlar göndermeye başladı, ancak daha derin içgörüler için rüya kaydetmeye devam edin.",
          source: "initial_patterns"
        }
      ],
      pattern: "Rüyalarınızda tekrar eden bazı unsurlar fark ediliyor. Bu tekrarlar, bilinçaltınızın size iletmeye çalıştığı mesajlar olabilir.",
      suggestion: "Rüya günlüğünüze devam edin ve rüyalarınızı detaylı şekilde tanımlayın. Her ayrıntı, bilinçaltınızı anlamak için değerlidir.",
      nextFocus: [
        "Rüyalarınızda tekrar eden karakterlere dikkat edin.",
        "Rüya mekanlarınız değişiyor mu yoksa benzer mekanlarda mı geçiyor?",
        "Hangi duygular rüyalarınızda baskın?"
      ],
      timestamp: new Date().toISOString(),
      dreamCount: dreamCount,
      locked: false
    };
  }
};

// Eksik tanımları ekleyelim
const generateDefaultSubInsights = (dreamCount) => {
  if (dreamCount >= 15) {
    return [
      {
        title: "Sembol Anlamları",
        content: "Rüyalarınızda tekrar eden semboller, bilinçaltınızın size iletmeye çalıştığı önemli mesajlardır. Su, uçmak, düşmek gibi semboller duygusal durumunuz hakkında ipucu verebilir. Rüyalarınızdaki sembol örüntülerini fark etmek, kendinizi daha derinden anlamanıza yardımcı olacaktır.",
        source: "symbol_analysis"
      },
      {
        title: "Arketip Yansımaları",
        content: "Jung'un kolektif bilinçdışı teorisine göre, arketipler evrensel sembolik motiflerdir. Rüyalarınızda Gölge, Persona, Anima/Animus gibi arketiplerin belirmesi, ruhsal gelişiminizin hangi aşamasında olduğunuzu gösterebilir. Bu arketiplerin izini sürmek, bireyleşme sürecinizi destekleyecektir.",
        source: "archetype_analysis"
      },
      {
        title: "Duygusal Denge",
        content: "Rüyalarınızdaki duygusal tonlar, günlük yaşamınızda işlenmemiş duyguları gösterebilir. Bu duygulara dikkat etmek, duygusal dengenizi iyileştirmenize yardımcı olabilir.",
        source: "emotion_analysis"
      },
      {
        title: "Tema Analizi",
        content: "Rüyalarınızdaki tekrar eden temalar, bilinçaltınızın sizinle iletişim kurma biçimidir. Bu temaları analiz etmek, hayatınızdaki önemli konuları ve çözülmemiş meseleleri anlamaya yardımcı olabilir.",
        source: "theme_analysis"
      }
    ];
  } else if (dreamCount >= 5) {
    return [
      {
        title: "Sembol İpucuçları",
        content: "Rüyalarınızda gördüğünüz semboller bilinçaltınızın bir yansımasıdır. Daha fazla rüya kaydettikçe, bu sembollerin sizin için ne anlama geldiğine dair daha derin içgörüler kazanacaksınız.",
        source: "symbol_analysis"
      },
      {
        title: "Arketip Kesfettirin",
        content: "Jung psikolojisine göre rüyalarınızda beliren arketipler, evrensel kolektif bilinçdışının yansımalarıdır. Daha fazla rüya kaydettikçe, hangi arketiplerin yaşamınızda etkin olduğunu keşfedeceksiniz.",
        source: "archetype_analysis"
      },
      {
        title: "Başlangıç İçgörüleri",
        content: "Rüya yolculuğunuz ilerliyor. Şu ana kadar kaydettiginiz rüyalarda bazı örüntüler belirmeye başladı. Daha fazla rüya kaydettikçe, bu örüntüler daha net hale gelecek.",
        source: "initial_analysis"
      }
    ];
  } else {
    return [
      {
        title: "İlk Sembol Yorumları",
        content: "Rüyalarınızdaki semboller hakkında içgörü kazanmak için daha fazla rüya kaydetmeye devam edin. Her sembol, bilinçaltınızdan gelen bir mesajdır.",
        source: "symbol_intro"
      },
      {
        title: "Arketip Yolculuğu",
        content: "Jung psikolojisinde arketipler, kolektif bilinçdışının yapı taşlarıdır. Rüyalarınızdaki arketipleri keşfetmek için rüya günlüğünüze devam edin.",
        source: "archetype_intro"
      },
      {
        title: "İlk İçgörüler",
        content: "Rüya yolculuğunuz henuz başlıyor. Daha fazla rüya kaydettikçe, bilinçaltınız hakkında daha derin içgörüler kazanacaksınız.",
        source: "initial_guidance"
      }
    ];
  }
};

const generateDefaultNextFocus = (dreamCount) => {
  if (dreamCount >= 15) {
    return [
      "Rüyalarınızdaki kişilerin davranışlarına ve sizinle etkileşimlerine dikkat edin.",
      "Rüyalarınızda kendinizi nasıl hissettiğinize ve bu duyguların günlük yaşamınızla bağlantısına odaklanın.",
      "Tekrar eden semboller ve temalarla ilgili detayları not edin."
    ];
  } else {
    return [
      "Rüyalarınızda tekrar eden karakterlere dikkat edin.",
      "Rüya mekanlarınız değişiyor mu yoksa benzer mekanlarda mı geçiyor?",
      "Hangi duygular rüyalarınızda baskın?"
    ];
  }
};

export default {
  generateInsights,
  getSymbolInsight,
  quickAnalyzeDream
};