import { AIClient } from '../ai/types';

export class AIGeneration {
  constructor(data: Partial<AIGeneration>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  id: string;
  message_sequence_id: string;
  prompt: Record<string, any>;
  output: Record<string, any>;
  client_type: AIClient;
  model: string;
  tokens_used: number;
  cost: number;
  created_at: Date;
  updated_at?: Date;
}
