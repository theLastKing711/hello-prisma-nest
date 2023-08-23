import { Prisma } from '@prisma/client';

export class WishListModel {
  product: CustomerProduct;
}

class CustomerProduct {
  id: number;
  name: string;
  imagePath: string;
  price: Prisma.Decimal;
  isBestSeller: boolean;
  discounts: ResponseDiscount[];
  reviews: Review[];
}

class Review {
  rating: Prisma.Decimal;
}

class ResponseDiscount {
  id: number;
  value: number;
}
