export class CreateProductDto {
  createdAt: Date;
  categoryId: string;
  name: string;
  price: number;
  file: string;
  isBestSeller: string;
  isFeatured?: boolean;
}
