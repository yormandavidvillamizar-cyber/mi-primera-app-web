'use server';

/**
 * @fileOverview Provides tone suggestions for a given conversation topic.
 *
 * - provideToneSuggestions - A function that generates tone suggestions for a conversation topic.
 * - ProvideToneSuggestionsInput - The input type for the provideToneSuggestions function.
 * - ProvideToneSuggestionsOutput - The return type for the provideToneSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideToneSuggestionsInputSchema = z.object({
  topic: z.string().describe('The conversation topic to analyze.'),
});

export type ProvideToneSuggestionsInput = z.infer<
  typeof ProvideToneSuggestionsInputSchema
>;

const ProvideToneSuggestionsOutputSchema = z.object({
  toneSuggestions: z
    .string()
    .describe('Suggestions for the appropriate tone and approach.'),
});

export type ProvideToneSuggestionsOutput = z.infer<
  typeof ProvideToneSuggestionsOutputSchema
>;

export async function provideToneSuggestions(
  input: ProvideToneSuggestionsInput
): Promise<ProvideToneSuggestionsOutput> {
  return provideToneSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideToneSuggestionsPrompt',
  input: {schema: ProvideToneSuggestionsInputSchema},
  output: {schema: ProvideToneSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides tone and approach suggestions for conversation topics.

  Analyze the following topic and suggest the appropriate tone and approach for effective communication:

  Topic: {{{topic}}}

  Tone Suggestions:`,
});

const provideToneSuggestionsFlow = ai.defineFlow(
  {
    name: 'provideToneSuggestionsFlow',
    inputSchema: ProvideToneSuggestionsInputSchema,
    outputSchema: ProvideToneSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
