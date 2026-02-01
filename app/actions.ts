'use server';

import { generateConversationTopics } from '@/ai/flows/generate-conversation-topics';
import { provideToneSuggestions } from '@/ai/flows/provide-tone-suggestions';
import { suggestQuestions } from '@/ai/flows/suggest-questions-for-topic';
import { z } from 'zod';

const TopicSchema = z.object({
  topic: z.string().min(1, 'El tema no puede estar vacío.'),
});

export async function generateTopicAction() {
  try {
    const result = await generateConversationTopics({});
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in generateTopicAction:', error);
    return { success: false, error: 'Failed to generate topic.' };
  }
}

export async function suggestQuestionsAction(input: { topic: string }) {
  try {
    const parsedInput = TopicSchema.parse(input);
    const result = await suggestQuestions(parsedInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in suggestQuestionsAction:', error);
    return { success: false, error: 'Failed to suggest questions.' };
  }
}

export async function provideToneAction(input: { topic: string }) {
  try {
    const parsedInput = TopicSchema.parse(input);
    const result = await provideToneSuggestions(parsedInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in provideToneAction:', error);
    return { success: false, error: 'Failed to provide tone suggestions.' };
  }
}
