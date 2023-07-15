export class ProductListDto {
  id: number;
  name: string;
}

export class ProductListWithCategoryIdDto extends ProductListDto {
  category: {
    id: number;
    name: string;
  };
}
