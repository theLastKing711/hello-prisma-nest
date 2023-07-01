import { Role } from '@prisma/client';

export class AppUser {
  id: number;
  createdAt: Date;
  userName: string;
  password: string;
  imagePath: string;
  cloudinary_public_id: string;
  role: Role;
}
