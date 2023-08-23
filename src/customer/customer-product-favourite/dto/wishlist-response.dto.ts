export class WishListResponseDto {
  id: number;
  imagePath: string;
  name: string;
  price: number;
  isBestSeller: boolean;
  discount: ResponseDiscount | null;
}

class ResponseDiscount {
  id: number;
  value: number;
}
