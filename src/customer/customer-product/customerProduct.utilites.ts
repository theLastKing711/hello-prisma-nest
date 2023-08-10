import { Prisma } from '@prisma/client';
import {
  ResponseCustomerProductDetailsDto,
  ResponseCustomerProductDto,
} from './dto/response-customer-product.dto';
import { CustomerProduct } from './entities/customer-product.entity';

export const transformCustomerProductToNonDecimalResponse = (
  product: CustomerProduct,
) => {
  const responseProduct: ResponseCustomerProductDto = {
    id: product.id,
    imagePath: product.imagePath,
    isBestSeller: product.isBestSeller,
    price: convertDecimalToFloat(product.price),
    name: product.name,
    discount:
      product.discounts.length > 0
        ? product.discounts[product.discounts.length - 1]
        : null,
    averageRating: calculateAverage(product.reviews.map((x) => x.rating)),
  };

  return responseProduct;
};

export const transformCustomerProductDetailsToNonDecimalResponse = (
  product: CustomerProduct,
) => {
  const responseProduct: ResponseCustomerProductDetailsDto = {
    id: product.id,
    imagePath: product.imagePath,
    isBestSeller: product.isBestSeller,
    price: convertDecimalToFloat(product.price),
    name: product.name,
    discount:
      product.discounts.length > 0
        ? product.discounts[product.discounts.length - 1]
        : null,
    averageRating: calculateAverage(product.reviews.map((x) => x.rating)),
    totalReviews: product.reviews.length,
  };

  return responseProduct;
};

export const calculateAverage = (values: Prisma.Decimal[]) => {
  const total = values.reduce((prev, curr) => {
    return prev + convertDecimalToFloat(curr);
  }, 0);

  const count = values.length;

  const average = total / count;

  return average;
};

const convertDecimalToFloat = (value: Prisma.Decimal) =>
  parseFloat(value.toFixed(2));
