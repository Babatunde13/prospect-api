import {
  IsString,
  IsUrl,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from '../prospect/prospect.entity';
import { AIMessage } from '../ai/types';

export class TovConfigDto {
  @ApiProperty({ type: 'number', description: 'formality', required: true })
  @IsNumber()
  @Min(0)
  @Max(1)
  formality: number;

  @ApiProperty({ type: 'number', description: 'formality', required: true })
  @IsNumber()
  @Min(0)
  @Max(1)
  warmth: number;

  @ApiProperty({ type: 'number', description: 'formality', required: true })
  @IsNumber()
  @Min(0)
  @Max(1)
  directness: number;
}

export class GenerateSequenceDto {
  @ApiProperty({
    type: 'string',
    description: 'linkedin prospect url',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  prospect_url: string;

  @ApiProperty({
    type: TovConfigDto,
    description: 'tov config',
    required: true,
  })
  @ValidateNested()
  @Type(() => TovConfigDto)
  tov_config: TovConfigDto;

  @ApiProperty({
    type: 'string',
    description: 'company context',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  company_context: string;

  @ApiProperty({
    type: 'number',
    description: 'sequence length',
    required: true,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  sequence_length: number;
}

export class BaseResponseDto<T = object> {
  @ApiProperty({
    example: 'success',
    type: 'string',
    readOnly: true,
    required: true,
  })
  message: string;

  @ApiProperty({
    example: true,
    type: 'boolean',
    readOnly: true,
    required: true,
  })
  success: boolean;

  @ApiProperty()
  data: T;
}

class GenerateSequenceResponse {
  @ApiProperty({ type: Prospect })
  prospect: Prospect;

  @ApiProperty({ type: [AIMessage] })
  messages: AIMessage[];

  @ApiProperty({ type: 'string' })
  analysis: string;

  @ApiProperty({ type: 'number' })
  tokens: number;

  @ApiProperty({ type: 'number' })
  cost: number;
}

export class GenerateSequenceResponseDto extends BaseResponseDto<GenerateSequenceResponse> {
  @ApiProperty({ example: 'Sequence generated successfully' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: GenerateSequenceResponse })
  data: GenerateSequenceResponse;
}
