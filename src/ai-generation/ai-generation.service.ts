import { Injectable } from '@nestjs/common';
import { AIGenerationRepository } from './ai-generation.repository';
import { AIGeneration } from './ai-generation.entity';
import { ulid } from 'ulid';
import { AIClient, AIMessage } from '../ai/types';

@Injectable()
export class AIGenerationService {
  constructor(private readonly repo: AIGenerationRepository) {}

  async logGeneration(
    sequenceId: string,
    prompt: any,
    output: { messages: AIMessage[]; analysis: string },
    clientType: AIClient,
    model: string,
    tokens: number,
    cost: number,
  ): Promise<AIGeneration> {
    return this.repo.create({
      id: ulid(),
      message_sequence_id: sequenceId,
      prompt,
      output,
      client_type: clientType,
      model,
      tokens_used: tokens,
      cost,
    });
  }
}
