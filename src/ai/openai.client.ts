import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AIServiceImpl, AIMessage } from './types';
import envs from '../config/envs';

interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

@Injectable()
export class OpenAIClient implements AIServiceImpl {
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-4o-mini';
  private readonly apiKey = envs.ApiKeys.openAI;

  // 💰 Pricing per 1K tokens for this model
  private readonly inputPricePer1K = 0.00015;
  private readonly outputPricePer1K = 0.0006;

  constructor(private readonly http: HttpService) {}

  async generateMessages(
    prospectSummary: string,
    companyContext: string,
    tovInstruction: string,
    sequenceLength: number,
  ): Promise<{
    messages: AIMessage[];
    analysis: string;
    tokens: number;
    cost: number;
  }> {
    const prompt = this.buildPrompt(
      prospectSummary,
      companyContext,
      tovInstruction,
      sequenceLength,
    );

    try {
      const response = await firstValueFrom(
        this.http.post(
          this.baseUrl,
          {
            model: this.model,
            messages: [
              { role: 'system', content: 'You are a B2B sales assistant.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const content: string =
        response.data.choices?.[0]?.message?.content || '{}';
      const usage: TokenUsage = response.data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };

      const cost = this.computeCost(usage);
      const tokens = usage.total_tokens;
      const { messages, analysis } = this.parseMessages(content);

      return {
        messages,
        analysis,
        tokens,
        cost,
      };
    } catch (err) {
      throw new HttpException(
        `Outreach message generation failed: ${err.response?.statusText || err.message}`,
        500,
      );
    }
  }

  /**
   * Build the AI prompt for message generation
   */
  buildPrompt(
    prospectSummary: string,
    companyContext: string,
    tovInstruction: string,
    sequenceLength: number,
  ): string {
    return `
Analyze the prospect based on the summary and company context, then generate ${sequenceLength} personalized outreach messages with the confidence and the thinking process.

Prospect Summary:
${prospectSummary}

Company Context:
${companyContext}

Tone of Voice:
${tovInstruction}

Always return JSON in this format:
{
  "analysis": "Brief summary of prospect and best outreach angle",
  "messages": [
    {
      "message": "string",
      "confidence": 0.0-1.0,
      "thinking": "reasoning behind this message"
    }
  ]
}`;
  }

  /**
   * Compute cost in USD from token usage
   */
  private computeCost(usage: TokenUsage): number {
    const inputCost = (usage.prompt_tokens / 1000) * this.inputPricePer1K;
    const outputCost = (usage.completion_tokens / 1000) * this.outputPricePer1K;
    return parseFloat((inputCost + outputCost).toFixed(6));
  }

  /**
   * Safely parse AI messages
   */
  private parseMessages(content: string): {
    analysis: string;
    messages: AIMessage[];
  } {
    try {
      return JSON.parse(content);
    } catch {
      return {
        analysis: 'AI failed to generate structured analysis',
        messages: [
          {
            message: content,
            confidence: 0.6,
            thinking: 'Fallback parse - AI did not return JSON',
          },
        ],
      };
    }
  }
}
