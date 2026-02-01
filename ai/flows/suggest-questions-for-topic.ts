'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting questions based on a given topic.
 *
 * The flow takes a topic as input and returns a list of suggested questions related to that topic.
 * It exports:
 *   - `suggestQuestions`: The main function to trigger the flow.
 *   - `SuggestQuestionsInput`: The input type for the `suggestQuestions` function.
 *   - `SuggestQuestionsOutput`: The output type for the `suggestQuestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate questions.'),
});
export type SuggestQuestionsInput = z.infer<typeof SuggestQuestionsInputSchema>;

const SuggestQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of suggested questions for the topic.'),
});
export type SuggestQuestionsOutput = z.infer<typeof SuggestQuestionsOutputSchema>;

export async function suggestQuestions(input: SuggestQuestionsInput): Promise<SuggestQuestionsOutput> {
  return suggestQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQuestionsPrompt',
  input: {schema: SuggestQuestionsInputSchema},
  output: {schema: SuggestQuestionsOutputSchema},
  prompt: `You are an AI assistant designed to generate engaging questions for a given topic.

  Topic: {{{topic}}}

  Generate a list of diverse and interesting questions that can be used to facilitate a conversation about the topic. Provide at least 5 questions.

  Format your response as a JSON object with a "questions" field containing an array of strings.`,
});

const suggestQuestionsFlow = ai.defineFlow(
  {
    name: 'suggestQuestionsFlow',
    inputSchema: SuggestQuestionsInputSchema,
    outputSchema: SuggestQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
