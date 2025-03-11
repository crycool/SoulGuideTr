import { ENV } from '../../../config/env';
import { initOpenAI, analyzeDream, getFollowUpQuestions, getDreamPatterns } from './openai';
import { DreamAnalysis } from '../_utils/messageTypes';

// OpenAI servisini başlat
initOpenAI(ENV.OPENAI_API_KEY);

const dreamAnalysisService = {
  analyzeDream: async (dreamContent: string): Promise<DreamAnalysis> => {
    try {
      console.log('Analyzing dream...');
      const analysis = await analyzeDream(dreamContent);
      return analysis;
    } catch (error) {
      console.error('Dream analysis error:', error);
      throw error;
    }
  },

  getFollowUpQuestions: async (
    dreamContent: string,
    previousAnalysis: DreamAnalysis
  ): Promise<string[]> => {
    try {
      return await getFollowUpQuestions(dreamContent, previousAnalysis);
    } catch (error) {
      console.error('Follow-up questions error:', error);
      throw error;
    }
  },

  getDreamPatterns: async (dreamHistory: DreamAnalysis[]): Promise<any> => {
    try {
      return await getDreamPatterns(dreamHistory);
    } catch (error) {
      console.error('Dream patterns analysis error:', error);
      throw error;
    }
  }
};

export { dreamAnalysisService as getDreamAnalysisService };
export default dreamAnalysisService;
