export class Product {
  id: number;
  createdAt: Date;
  categoryId: number;
  name: string;
  price: number;
  imagePath: string;
  isBestSeller: boolean;
  cloudinary_public_id: string;
  isFeatured: boolean;
}
