import { Injectable } from '@nestjs/common';
import { AIServiceImpl, AIClient } from './types';
import { OpenAIClient } from './openai.client';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AIService {
  static fromClient(client: AIClient, http: HttpService): AIServiceImpl {
    switch (client) {
      case AIClient.OPENAI:
        return new OpenAIClient(http);
      default:
        throw new Error(`AI Client ${client} not supported`);
    }
  }
}
