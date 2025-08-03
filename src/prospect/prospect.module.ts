import { Module } from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { ProspectRepository } from './prospect.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProspectRepository, ProspectService],
  exports: [ProspectService],
})
export class ProspectModule {}
