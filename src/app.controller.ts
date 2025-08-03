import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  GenerateSequenceDto,
  GenerateSequenceResponseDto,
} from './dto/generate-sequence.dto';
import { successResponse } from './utils/response';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate-sequence')
  @ApiBody({
    description: 'Generate Sequence',
    type: GenerateSequenceDto,
  })
  @ApiOkResponse({
    description: 'Generate Sequence',
    type: GenerateSequenceResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async generateSequence(
    @Body() body: GenerateSequenceDto,
  ): Promise<GenerateSequenceResponseDto> {
    const d = await this.appService.generateSequence(body);
    return successResponse(d, 'Sequence generated successfully!');
  }
}
