import { Category } from '../entities/category.entity';

export type responseCategoryDto = Omit<
  Category,
  'cloudinary_public_id' | 'password' | 'role'
>;
