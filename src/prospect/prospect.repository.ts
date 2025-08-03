import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prospect, TovConfig } from './prospect.entity';
import { ulid } from 'ulid';
import { TovConfigDto } from '../dto/generate-sequence.dto';

@Injectable()
export class ProspectRepository {
  private readonly table = 'prospects';
  private readonly tovTable = 'tov_configs';

  constructor(private readonly db: DatabaseService) {}

  async create(data: Partial<Prospect>): Promise<Prospect> {
    return this.db.insert<Prospect>(this.table, data);
  }

  async findProspectByUrl(url: string): Promise<Prospect | null> {
    return this.db.findOne<Prospect>(this.table, { linkedin_url: url });
  }

  async updateProspect(
    id: string,
    data: Partial<Prospect>,
  ): Promise<Prospect | null> {
    return this.db.update<Prospect>(this.table, { id }, data);
  }

  async findTovtByProspectId(prospectId: string): Promise<TovConfig | null> {
    return this.db.findOne<TovConfig>(this.table, { prospect_id: prospectId });
  }

  async upsertTOV(prospectId: string, tov: TovConfigDto) {
    const existing = await this.db.findOne<TovConfig>(this.tovTable, {
      prospect_id: prospectId,
    });
    if (existing) {
      const t = await this.db.update<TovConfig>(
        this.tovTable,
        { prospect_id: prospectId },
        tov,
      );
      return t!;
    }
    return this.db.insert<TovConfig>(this.tovTable, {
      id: ulid(),
      prospect_id: prospectId,
      directness: tov.directness,
      formality: tov.formality,
      warmth: tov.warmth,
    });
  }
}
