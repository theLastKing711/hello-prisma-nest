import { AppUser } from '../entities/app-user.entity';

export type ResponseAppUser = Omit<
  AppUser,
  'cloudinary_public_id' | 'password' | 'role'
>;
