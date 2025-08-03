import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProspectModule } from './prospect/prospect.module';
import { MessageSequenceModule } from './message-sequence/message-sequence.module';
import { AiGenerationModule } from './ai-generation/ai-generation.module';
import { AIModule } from './ai/ai.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ProspectModule,
    MessageSequenceModule,
    AiGenerationModule,
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
