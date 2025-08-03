import { Module } from '@nestjs/common';
import { MessageSequenceService } from './message-sequence.service';
import { MessageSequenceRepository } from './message-sequence.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MessageSequenceRepository, MessageSequenceService],
  exports: [MessageSequenceService],
})
export class MessageSequenceModule {}
