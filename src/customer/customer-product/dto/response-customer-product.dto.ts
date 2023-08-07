export class ResponseCustomerProductDto {
  id: number;
  imagePath: string;
  name: string;
  price: number;
  isBestSeller: boolean;
  discount: ResponseDiscount | null;
  averageRating: number;
}

class ResponseDiscount {
  id: number;
  value: number;
}
