import { Prisma } from '@prisma/client';

export class CustomerProduct {
  id: number;
  name: string;
  imagePath: string;
  price: Prisma.Decimal;
  isBestSeller: boolean;
  discounts: ResponseDiscount[];
  reviews: Review[];
  ProductFavourite: { id: number}[];
}

class Review {
  rating: Prisma.Decimal;
}

class ResponseDiscount {
  id: number;
  value: number;
}
