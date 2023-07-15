import { Decimal } from '@prisma/client/runtime';

export class ResponseProductDto {
  id: number;
  createdAt: Date;
  categoryId: number;
  category: ResponseCategoryDto;
  name: string;
  price: Decimal;
  imagePath: string;
  isBestSeller: boolean;
  cloudinary_public_id: string;
}

export class ResponseProductDtoNonDecimal {
  id: number;
  createdAt: Date;
  categoryId: number;
  category: ResponseCategoryDto;
  name: string;
  price: number;
  imagePath: string;
  isBestSeller: boolean;
}

class ResponseCategoryDto {
  name: string;
}
