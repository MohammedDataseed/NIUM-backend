import { Partner } from '../models/partner.model';

export const repositoryProviders = [
  {
    provide: 'PARTNER_REPOSITORY',
    useValue: Partner,
  },
];
