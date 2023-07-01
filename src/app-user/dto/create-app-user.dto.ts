import { Role } from '@prisma/client';

export class CreateAppUserDto {
  createdAt: Date;
  userName: string;
  password: string;
  file: string;
  role?: Role;
}

export class CreateAppUserDtoWithCloudinaryPublicId extends CreateAppUserDto {
  cloudinary_public_id: string;
}
