import {
  ResponseProductDto,
  ResponseProductDtoNonDecimal,
} from './dto/response-product.dto';

export const transformProductToNonDecimalResponse = (
  product: ResponseProductDto,
) => {
  const responseProduct: ResponseProductDtoNonDecimal = {
    id: product.id,
    categoryId: product.categoryId,
    isBestSeller: product.isBestSeller,
    price: parseFloat(product.price.toFixed(2)),
    category: {
      name: product.name,
    },
    createdAt: product.createdAt,
    imagePath: product.imagePath,
    name: product.name,
  };

  return responseProduct;
};
