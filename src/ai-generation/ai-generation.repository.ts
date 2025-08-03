import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AIGeneration } from './ai-generation.entity';

@Injectable()
export class AIGenerationRepository {
  private readonly table = 'ai_generations';

  constructor(private readonly db: DatabaseService) {}

  async create(data: Partial<AIGeneration>): Promise<AIGeneration> {
    return this.db.insert<AIGeneration>(this.table, data);
  }

  async findByMessageSequence(sequenceId: string): Promise<AIGeneration[]> {
    return this.db.findAll<AIGeneration>(this.table, {
      message_sequence_id: sequenceId,
    });
  }
}
