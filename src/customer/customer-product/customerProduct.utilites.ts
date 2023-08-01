
import { ResponseCustomerProductDto } from './dto/response-customer-product.dto';
import { CustomerProduct } from './entities/customer-product.entity';

export const transformCustomerProductToNonDecimalResponse = (
  product: CustomerProduct,
) => {
  const responseProduct: ResponseCustomerProductDto = {
    id: product.id,
    isBestSeller: product.isBestSeller,
    price: parseFloat(product.price.toFixed(2)),
    name: product.name,
    discount:
      product.discounts.length > 0
        ? product.discounts[product.discounts.length - 1]
        : null,
  };

  return responseProduct;
};
