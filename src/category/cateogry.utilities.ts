import { responseCategoryDto } from './dto/response-category.dto';
import { Category } from './entities/category.entity';

export const transformCategoryToResponse = (category: Category) => {
  const responseCategory: responseCategoryDto = {
    id: category.id,
    createdAt: category.createdAt,
    imagePath: category.imagePath,
    name: category.name,
  };

  return responseCategory;
};
