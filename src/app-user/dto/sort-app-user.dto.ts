import { SortType } from 'src/shared/shared.type';
import { ResponseAppUserDto } from './response-app-user.dto';
import { Prisma, Role } from '@prisma/client';

export class SortAppUserDto {
  limit: string;
  page: string;
  // sort: [keyof Prisma.AppUserOrderByWithRelationInput, SortType];
  sort: string[];
  offset: string;
  filter?: string[];
}
