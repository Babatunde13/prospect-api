import { ApiProperty } from '@nestjs/swagger';

export enum AIClient {
  OPENAI = 'OPENAI',
  CLAUDE = 'CLAUDE',
}

export class AIMessage {
  @ApiProperty({ type: 'string', readOnly: true })
  message: string;

  @ApiProperty({ type: 'number', readOnly: true })
  confidence: number;

  @ApiProperty({ type: 'string', readOnly: true })
  thinking: string;
}

export abstract class AIServiceImpl {
  abstract generateMessages(
    prospectSummary: string,
    companyContext: string,
    tovInstruction: string,
    sequenceLength: number,
  ): Promise<{
    messages: AIMessage[];
    analysis: string;
    tokens: number;
    cost: number;
  }>;

  abstract buildPrompt(
    prospectSummary: string,
    companyContext: string,
    tovInstruction: string,
    sequenceLength: number,
  ): string;
}
