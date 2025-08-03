import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MessageSequence } from './message-sequence.entity';

@Injectable()
export class MessageSequenceRepository {
  private readonly table = 'message_sequences';

  constructor(private readonly db: DatabaseService) {}

  async create(data: Partial<MessageSequence>): Promise<MessageSequence> {
    return this.db.insert<MessageSequence>(this.table, data);
  }

  async findById(id: string): Promise<MessageSequence | null> {
    return this.db.findOne<MessageSequence>(this.table, { id });
  }

  async findByProspect(prospectId: string): Promise<MessageSequence[]> {
    return this.db.findAll<MessageSequence>(this.table, {
      prospect_id: prospectId,
    });
  }
}
