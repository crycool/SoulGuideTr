import dreamPrompts from '../_utils/chatPrompts';
import { DreamAnalysis } from '../_utils/messageTypes';
import { ENV } from '../../../config/env';
import archetypeStore from '../_utils/archetypeStore';


export const getSymbolMeaning = async (symbol: string): Promise<{meaning: string}> => {
  try {
    const response = await createChatCompletion([
      {
        role: "system",
        content: `Sen bir rüya yorumcusu ve sembol uzmanısın. Kullanıcının verdiği sembol hakkında Jung psikolojisi perspektifinden detaylı bir açıklama yapmalısın.
        Lütfen yanıtını JSON formatında ver. Çıktı formatı:
        {
          "meaning": "sembolün detaylı açıklaması"
        }
        NOT: Yanıt kesinlikle JSON olmalıdır.`
      },
      {
        role: "user",
        content: `Rüyalarımda sıkça gördüğüm "${symbol}" sembolünün anlamı nedir?`
      }
    ], 0.7, 500);

    if (!response) {
      return {
        meaning: "Bu sembolün anlamı henüz veritabanımızda bulunmuyor. Rüya yorumlama sayfasında bu sembolle ilgili yorumlar alabilirsiniz."
      };
    }

    try {
      const cleanedResponse = response.trim();
      return JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('JSON parse error:', e, 'Response:', response);
      return {
        meaning: "Sembol anlamı alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      };
    }
  } catch (error) {
    console.error('Symbol meaning error:', error);
    return {
      meaning: "Sembol anlamı alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    };
  }
};


const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

let apiKey: string;

export const initOpenAI = (key: string) => {
  apiKey = key;
};

interface OpenAIResponse {
  emotions: Array<{type: string, intensity: number, context: string}>;
  symbols: Array<{name: string, meaning: string}>;
  archetypes: string[];
  clarity: number;
  mainTheme: string;
  insights: string[];
  suggestions: string[];
}

export const createChatCompletion = async (messages: any[], temperature = 0.7, max_tokens = 3000) => {
  try {
    // Direkt olarak ENV'den API anahtarını al
    const apiKeyToUse = ENV.OPENAI_API_KEY;
    
    // API anahtarı kontrolü
    if (!apiKeyToUse) {
      console.error('API ANAHTARI BULUNAMADI!');
      throw new Error('OpenAI API anahtarı bulunamadı');
    }
    
    console.log(`API anahtarı mevcut: ${!!apiKeyToUse} (ilk 5 karakter: ${apiKeyToUse.substring(0, 5)}...)`);
    
    // API isteği gönderme
    const requestData = {
      model: "gpt-4o-mini", // Gelismis model kullan
      messages,
      temperature,
      max_tokens,
      response_format: messages[0].content.includes('JSON') ? { type: "json_object" } : undefined
    };
    
    console.log('OpenAI API isteği gönderiliyor...');
    console.log('Request body:', JSON.stringify(requestData).slice(0, 200) + '...');
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyToUse}`
      },
      body: JSON.stringify(requestData)
    });

    console.log('API yanıt durumu:', response.status, response.statusText);


    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response data:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('OpenAI yanıtı boş veya geçersiz format');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const analyzeDream = async (dreamContent: string): Promise<DreamAnalysis> => {
  try {
    console.log('Starting dream analysis...');
    const response = await createChatCompletion([
      {
        role: "system",
        content: `Sen profesyonel bir rüya analisti ve psikologsun. Jung psikolojisi konusunda uzmansın. Türkçe yanıt vermelisin.
        Lütfen yanıtını JSON formatında ver. Çıktı formatı şu şekilde olmalı:
        {
          "emotions": [{"type": "string", "intensity": number, "context": "string"}],
          "symbols": [{"name": "string", "meaning": "string"}],
          "archetypes": ["string"],
          "clarity": number,
          "mainTheme": "string",
          "insights": ["string"],
          "suggestions": ["string"]
        }
        Önemli Notlar:
        1. Tüm çıktılar tamamen Türkçe olmalıdır
        2. mainTheme alanı rüyanın ana temasını kısa ve öz bir şekilde açıklamalıdır
        3. insights alanındaki her bir madde en az 3-4 cümle içermeli ve rüyanın derinlemesine psikolojik analizini yapmalıdır
        4. Analiz Jung psikolojisi perspektifinden, semboller, duygular ve arketipleri dikkate alarak yapılmalıdır
        5. Yanıt kesinlikle JSON olmalıdır ve "json" kelimesi içermelidir.`
      },
      {
        role: "user",
        content: dreamContent
      }
    ], 0.5, 1000);

    if (!response) {
      throw new Error('OpenAI yanıtı boş');
    }

    try {
      const cleanedResponse = response.trim();
      const analysis = JSON.parse(cleanedResponse) as OpenAIResponse;
      console.log('Parsed analysis:', analysis);
      console.log('ARKETIPLER:', analysis.archetypes);
      
      // Arketipleri global store'a kaydet (asenkron işlem)
      if (analysis.archetypes && analysis.archetypes.length > 0) {
        // Bu asenkron işlemi await ile beklemiyoruz çünkü kısa bir bekleme sonraki adımlar için önemli değil
        // Ama try-catch ile olası hataları yakalayıp işlemin devam etmesini sağlıyoruz
        try {
          archetypeStore.setArchetypes(analysis.archetypes)
            .then(() => console.log('Arketipler başarıyla kaydedildi'))
            .catch(err => console.error('Arketip kaydetme hatası:', err));
        } catch (storeError) {
          console.error('Arketip store hatası:', storeError);
          // Hata olsa bile işleme devam et
        }
      }

      return {
        id: Date.now().toString(),
        content: dreamContent,
        timestamp: new Date(),
        emotions: analysis.emotions || [],
        symbols: analysis.symbols || [],
        clarity: analysis.clarity || 5,
        isLucid: dreamContent.toLowerCase().includes('lucid') || dreamContent.toLowerCase().includes('farkında'),
        tags: analysis.archetypes || [],
        insights: analysis.insights || [],
        suggestions: analysis.suggestions || [],
        mainTheme: analysis.mainTheme || 'Analiz yapılıyor...'
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', response);
      throw new Error('JSON parse hatası');
    }
  } catch (error) {
    console.error('Dream analysis error:', error);
    throw new Error('Rüya analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
  }
};

export const getDreamPatterns = async (dreamHistory: DreamAnalysis[]): Promise<any> => {
  try {
    const response = await createChatCompletion([
      {
        role: "system",
        content: `Rüya geçmişini analiz et ve yanıtını JSON formatında ver:
        {
          "patterns": ["örüntü1", "örüntü2"],
          "insights": ["içgörü1", "içgörü2"],
          "suggestions": ["öneri1", "öneri2"]
        }
        NOT: Yanıt kesinlikle JSON olmalıdır ve "json" kelimesi içermelidir.`
      },
      {
        role: "user",
        content: JSON.stringify(dreamHistory, null, 2)
      }
    ], 0.7, 500);

    if (!response) {
      return {
        patterns: [],
        insights: ['Daha fazla rüya analizi yapıldıkça örüntüler ortaya çıkacaktır.'],
        suggestions: ['Rüya günlüğü tutmaya devam edin.']
      };
    }

    try {
      const cleanedResponse = response.trim();
      return JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('Pattern analysis parse error:', e, 'Response:', response);
      return {
        patterns: [],
        insights: ['Analiz sırasında bir hata oluştu.'],
        suggestions: ['Lütfen tekrar deneyin.']
      };
    }
  } catch (error) {
    console.error('Dream patterns analysis error:', error);
    return {
      patterns: [],
      insights: ['Sistem hatası oluştu.'],
      suggestions: ['Daha sonra tekrar deneyin.']
    };
  }
};

export const getFollowUpQuestions = async (dreamContent: string, previousAnalysis: DreamAnalysis): Promise<string[]> => {
  try {
    const response = await createChatCompletion([
      {
        role: "system",
        content: `Sen bir rüya analisti olarak, kullanıcının rüyasını derinleştirmek için 3 soru üretmelisin.
        Lütfen yanıtını JSON formatında ver. Çıktı formatı:
        {
          "questions": [
            "soru1",
            "soru2",
            "soru3"
          ]
        }
        NOT: Yanıt kesinlikle JSON olmalıdır ve "json" kelimesi içermelidir.`
      },
      {
        role: "user",
        content: `Rüya: ${dreamContent}\n\nÖnceki Analiz: ${JSON.stringify(previousAnalysis, null, 2)}`
      }
    ], 0.7, 250);

    if (!response) return dreamPrompts.followUp;

    try {
      const cleanedResponse = response.trim();
      const parsed = JSON.parse(cleanedResponse);
      return parsed.questions || dreamPrompts.followUp;
    } catch (e) {
      console.error('Follow-up questions parse error:', e, 'Response:', response);
      return dreamPrompts.followUp;
    }
  } catch (error) {
    console.error('Follow-up questions error:', error);
    return dreamPrompts.followUp;
  }
};

export default {
  initOpenAI,
  analyzeDream,
  getFollowUpQuestions,
  getDreamPatterns,
  createChatCompletion,
  getSymbolMeaning
};