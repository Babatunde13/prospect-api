import { LinkedInClientImpl, LinkedInProfile } from './linkedin.client';

export class MockLinkedInClient implements LinkedInClientImpl {
  async fetchProfile(url: string): Promise<LinkedInProfile> {
    const slug = url.split('/').filter(Boolean).pop() || 'unknown';
    return new Promise((resolve) =>
      resolve({
        name: slug.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        title: 'Software Engineer',
        company: 'Acme Corp',
        profile_data: { url, source: 'mock' },
        location: 'Lagos, Nigeria',
      }),
    );
  }
}
