import { Prisma } from '@prisma/client';
import { WishListModel } from './dto/wishlist-response';
import { WishListResponseDto } from './dto/wishlist-response.dto';

export const transformCustomerProductFavourites = (product: WishListModel) => {
  const responseProduct: WishListResponseDto = {
    id: product.product.id,
    imagePath: product.product.imagePath,
    isBestSeller: product.product.isBestSeller,
    price: convertDecimalToFloat(product.product.price),
    name: product.product.name,
    discount:
      product.product.discounts.length > 0
        ? product.product.discounts[product.product.discounts.length - 1]
        : null,
  };

  return responseProduct;
};
const convertDecimalToFloat = (value: Prisma.Decimal) =>
  parseFloat(value.toFixed(2));
