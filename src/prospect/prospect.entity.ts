import { ApiProperty } from '@nestjs/swagger';

export class Prospect {
  constructor(data: Partial<Prospect>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  @ApiProperty({ type: 'string', readOnly: true })
  id: string;

  @ApiProperty({ type: 'string', readOnly: true })
  linkedin_url: string;

  @ApiProperty({ type: 'string', readOnly: true })
  name: string;

  @ApiProperty({ type: 'string', readOnly: true })
  title: string;

  @ApiProperty({ type: 'string', readOnly: true })
  company: string;

  @ApiProperty({ type: 'string', readOnly: true })
  location: string;

  @ApiProperty({ type: 'string', readOnly: true })
  profile_data: string;

  @ApiProperty({ type: 'string', readOnly: true })
  created_at: Date;

  @ApiProperty({ type: 'string', readOnly: true })
  updated_at?: Date;
}

export class TovConfig {
  constructor(data: Partial<TovConfig>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  @ApiProperty({ type: 'string', readOnly: true })
  id: string;

  @ApiProperty({ type: 'string', readOnly: true })
  prospect_id: string;

  @ApiProperty({ type: 'number', readOnly: true })
  formality: number;

  @ApiProperty({ type: 'number', readOnly: true })
  warmth: number;

  @ApiProperty({ type: 'number', readOnly: true })
  directness: number;

  @ApiProperty({ type: 'string', readOnly: true })
  created_at: Date;

  @ApiProperty({ type: 'string', readOnly: true })
  updated_at?: Date;
}
