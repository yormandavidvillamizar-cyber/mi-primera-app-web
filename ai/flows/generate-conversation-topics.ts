'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating random conversation topics in Spanish.
 *
 * It includes:
 * - generateConversationTopics: A function to generate conversation topics.
 * - GenerateConversationTopicsInput: The input type for the function (currently empty).
 * - GenerateConversationTopicsOutput: The output type for the function (a string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateConversationTopicsInputSchema = z.object({})
export type GenerateConversationTopicsInput = z.infer<typeof GenerateConversationTopicsInputSchema>;

// Define the output schema
const GenerateConversationTopicsOutputSchema = z.object({
  topic: z.string().describe('A random conversation topic in Spanish.'),
});
export type GenerateConversationTopicsOutput = z.infer<typeof GenerateConversationTopicsOutputSchema>;


// Exported function to generate conversation topics
export async function generateConversationTopics(
  input: GenerateConversationTopicsInput
): Promise<GenerateConversationTopicsOutput> {
  return generateConversationTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConversationTopicsPrompt',
  input: {schema: GenerateConversationTopicsInputSchema},
  output: {schema: GenerateConversationTopicsOutputSchema},
  prompt: 'Genera un tema de conversación aleatorio en español.',
});

// Define the Genkit flow
const generateConversationTopicsFlow = ai.defineFlow(
  {
    name: 'generateConversationTopicsFlow',
    inputSchema: GenerateConversationTopicsInputSchema,
    outputSchema: GenerateConversationTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
