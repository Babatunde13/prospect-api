import { ApiProperty } from '@nestjs/swagger';

export class Sequence {
  @ApiProperty({ type: 'string', readOnly: true })
  message: string;

  @ApiProperty({ type: 'string', readOnly: true })
  confidence: number;

  @ApiProperty({ type: 'string', readOnly: true })
  thinking: string;
}

export class MessageSequence {
  constructor(data: Partial<MessageSequence>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  id: string;
  prospect_id: string;
  tov_config_id: string | null;
  company_context: string;
  sequences: string; // stringified version of the sequence array.
  sequence_length: number;
  created_at: Date;
  updated_at?: Date;
}
