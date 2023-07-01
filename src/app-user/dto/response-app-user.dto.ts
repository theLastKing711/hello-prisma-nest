import { AppUser } from '../entities/app-user.entity';

export type ResponseAppUserDto = Omit<
  AppUser,
  'cloudinary_public_id' | 'password' | 'role'
>;
