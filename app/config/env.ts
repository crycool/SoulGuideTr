import Constants from 'expo-constants';
import { API_KEY } from '@env';

const expoConstants = Constants.expoConfig?.extra;

export const ENV = {
  // API anahtarını .env dosyasından alıyoruz
  OPENAI_API_KEY: API_KEY || expoConstants?.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
};

export default ENV;