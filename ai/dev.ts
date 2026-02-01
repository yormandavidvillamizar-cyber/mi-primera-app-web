import { config } from 'dotenv';
config();

import '@/ai/flows/provide-tone-suggestions.ts';
import '@/ai/flows/generate-conversation-topics.ts';
import '@/ai/flows/suggest-questions-for-topic.ts';