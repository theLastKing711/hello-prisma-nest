export class ResponseCustomerProductDto {
  id: number;
  name: string;
  price: number;
  isBestSeller: boolean;
  discount: ResponseDiscount | null;
}

class ResponseDiscount {
  id: number;
  value: number;
}
