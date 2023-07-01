import { ResponseProductDto } from './dto/response-product.dto';
import { Product } from './entities/product.entity';

export const transformProductToResponse = (product: Product) => {
  const responseProduct: ResponseProductDto = {
    id: product.id,
    categoryId: product.categoryId,
    isBestSeller: product.isBestSeller,
    price: product.price,
    createdAt: product.createdAt,
    imagePath: product.imagePath,
    name: product.name,
  };

  return responseProduct;
};
