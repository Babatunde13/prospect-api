import { Module } from '@nestjs/common';
import { AIGenerationRepository } from './ai-generation.repository';
import { AIGenerationService } from './ai-generation.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AIGenerationRepository, AIGenerationService],
  exports: [AIGenerationService],
})
export class AiGenerationModule {}
