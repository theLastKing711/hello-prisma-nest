export class ResponseReviewDto {
  id: number;
  createdAt: Date;
  productId: number;
  product: ResponseProductDto;
  appUserId: number;
  appUser: ResponseAppUserDto;
  rating: number;
  body: string;
}

class ResponseProductDto {
  name: string;
}

class ResponseAppUserDto {
  userName: string;
}
