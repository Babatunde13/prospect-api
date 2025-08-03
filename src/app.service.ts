import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ProspectService } from './prospect/prospect.service';
import { MessageSequenceService } from './message-sequence/message-sequence.service';
import { AIGenerationService } from './ai-generation/ai-generation.service';
import { AIService } from './ai/ai.service';
import { translateTOV } from './ai/tov.translator';
import { GenerateSequenceDto } from './dto/generate-sequence.dto';
import { AIServiceImpl, AIClient } from './ai/types';
import { LogAction } from './logger/app.logger';

@Injectable()
export class AppService {
  private readonly aiService: AIServiceImpl;
  private readonly clientType = AIClient.OPENAI;
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly prospectService: ProspectService,
    private readonly messageSequenceService: MessageSequenceService,
    private readonly aiGenerationService: AIGenerationService,
  ) {
    this.aiService = AIService.fromClient(this.clientType, this.httpService);
  }

  async generateSequence(input: GenerateSequenceDto) {
    const { prospect, tov } = await this.prospectService.findOrCreate(
      input.prospect_url,
      input.tov_config,
    );

    const prospectSummary = `${prospect.name || 'Unknown'} (${prospect.title || 'N/A'}) at ${prospect.company || 'Unknown Company'}`;
    const tovInstruction = translateTOV(
      input.tov_config.formality,
      input.tov_config.warmth,
      input.tov_config.directness,
    );

    const { cost, messages, tokens, analysis } =
      await this.aiService.generateMessages(
        prospectSummary,
        input.company_context,
        tovInstruction,
        input.sequence_length,
      );

    this.logger.log('AI messages generated successfully', {
      prospect_url: input.prospect_url,
      cost,
      action: LogAction.GENERATE_SEQUENCE,
    });

    const sequence = await this.messageSequenceService.create(
      prospect.id,
      input.company_context,
      tov.id,
      messages,
      input.sequence_length,
    );

    const aiGeneration = await this.aiGenerationService.logGeneration(
      sequence.id,
      { prospectSummary, tovInstruction },
      { messages, analysis },
      this.clientType,
      'gpt-4o-mini',
      tokens,
      cost,
    );

    this.logger.log('AI messages logged successfully', {
      prospect_url: input.prospect_url,
      cost,
      ai_generation_id: aiGeneration.id,
      action: LogAction.GENERATE_SEQUENCE,
    });

    return { prospect, analysis, messages, tokens, cost };
  }
}
