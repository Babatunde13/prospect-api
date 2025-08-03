import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { MessageSequenceRepository } from './message-sequence.repository';
import { MessageSequence, Sequence } from './message-sequence.entity';

@Injectable()
export class MessageSequenceService {
  constructor(private readonly repo: MessageSequenceRepository) {}

  async create(
    prospectId: string,
    companyContext: string,
    tovConfigId: string,
    sequence: Sequence[],
    length: number,
  ): Promise<MessageSequence> {
    return this.repo.create({
      id: ulid(),
      prospect_id: prospectId,
      company_context: companyContext,
      sequences: JSON.stringify(sequence),
      sequence_length: length,
      tov_config_id: tovConfigId,
    });
  }
}
