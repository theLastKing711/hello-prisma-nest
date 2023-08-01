import { Prisma } from '@prisma/client';

export class CustomerProduct {
  id: number;
  name: string;
  price: Prisma.Decimal;
  isBestSeller: boolean;
  discounts: ResponseDiscount[];
}

class ResponseDiscount {
  id: number;
  value: number;
}
