export class LinkedInProfile {
  name: string;
  title: string;
  company: string;
  location: string;
  profile_data: any;
}

export abstract class LinkedInClientImpl {
  abstract fetchProfile(url: string): Promise<LinkedInProfile>;
}
