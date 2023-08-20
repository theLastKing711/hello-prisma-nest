export class LatestProductListDto {
  id: number;
  imagePath: string;
  name: string;
  price: number;
  discount: ResponseDiscount | null;
  isFavourite: boolean;
}

class ResponseDiscount {
  id: number;
  value: number;
}
