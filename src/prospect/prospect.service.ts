import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { ProspectRepository } from './prospect.repository';
import { Prospect, TovConfig } from './prospect.entity';
import { MockLinkedInClient } from './linkedin/linkedin.mock.client';
import { LinkedInClientImpl } from './linkedin/linkedin.client';
import { TovConfigDto } from '../dto/generate-sequence.dto';

@Injectable()
export class ProspectService {
  private linkedinClient: LinkedInClientImpl;
  constructor(private readonly repo: ProspectRepository) {
    this.linkedinClient = new MockLinkedInClient();
  }

  async findOrCreate(
    url: string,
    tovConfig: TovConfigDto,
  ): Promise<{ prospect: Prospect; tov: TovConfig }> {
    const existing = await this.repo.findProspectByUrl(url);
    if (existing) {
      const tov = await this.repo.upsertTOV(existing.id, tovConfig);
      return { prospect: existing, tov };
    }

    const profile = await this.linkedinClient.fetchProfile(url);
    const prospect = await this.repo.create({
      id: ulid(),
      linkedin_url: url,
      name: profile.name,
      company: profile.company,
      title: profile.title,
      location: profile.location,
      profile_data: profile.profile_data,
    });

    const tov = await this.repo.upsertTOV(prospect.id, tovConfig);
    return { prospect, tov };
  }
}
