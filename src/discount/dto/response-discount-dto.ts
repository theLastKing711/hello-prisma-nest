export class ResponseDiscountDto {
  id: number;
  createdAt: Date;
  productId: number;
  product: ResponseProductDto;
  startDate: Date;
  endDate: Date;
  value: number;
}

class ResponseProductDto {
  name: string;
}
