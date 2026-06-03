import { TranslationServiceClient } from '@google-cloud/translate';

export interface ITranslationService {
  translate(text: string, targetLocale: string): Promise<string>;
  translateBatch(texts: string[], targetLocale: string): Promise<string[]>;
}

export class GoogleTranslationService implements ITranslationService {
  private client: TranslationServiceClient | null = null;
  private projectId: string | undefined;

  constructor() {
    this.projectId = process.env.GOOGLE_PROJECT_ID;
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      this.client = new TranslationServiceClient({
        apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      });
    }
  }

  async translate(text: string, targetLocale: string): Promise<string> {
    if (!this.client || !text) return text;

    try {
      const [response] = await this.client.translateText({
        parent: `projects/${this.projectId || 'fixmyhyderabad'}`,
        contents: [text],
        mimeType: 'text/plain',
        targetLanguageCode: targetLocale,
      });

      return response.translations?.[0]?.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async translateBatch(texts: string[], targetLocale: string): Promise<string[]> {
    if (!this.client || !texts.length) return texts;

    try {
      const [response] = await this.client.translateText({
        parent: `projects/${this.projectId || 'fixmyhyderabad'}`,
        contents: texts,
        mimeType: 'text/plain',
        targetLanguageCode: targetLocale,
      });

      return response.translations?.map(t => t.translatedText || '') || texts;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    }
  }
}

export const translationService = new GoogleTranslationService();
