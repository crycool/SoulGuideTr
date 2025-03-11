// API anahtarını .env dosyasından import ediyoruz
import { API_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

let apiKey;

export const initOpenAI = (key) => {
  apiKey = key;
};

export const createChatCompletion = async (messages, temperature = 0.7, max_tokens = 800) => {
  try {
    if (!apiKey && !API_KEY) {
      throw new Error('OpenAI API anahtarı bulunamadı');
    }

    // Mesajların herhangi birinde 'json' kelimesi geçiyor mu kontrol et
    const containsJsonKeyword = messages.some(msg => 
      msg.content && msg.content.toLowerCase().includes('json')
    );
    
    // Response format parametresini hazırla
    const responseFormat = containsJsonKeyword 
      ? { response_format: { type: "json_object" } }
      : {};

    console.log('Sending request to OpenAI...');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature,
        max_tokens,
        ...responseFormat
      })
    });

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

export default {
  initOpenAI,
  createChatCompletion
};