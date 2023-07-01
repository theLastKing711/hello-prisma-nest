import { ResponseAppUser } from './dto/response-app-user.dto';
import { AppUser } from './entities/app-user.entity';

export const transformAppUserToResponse = (appUser: AppUser) => {
  const responseAppUser: ResponseAppUser = {
    id: appUser.id,
    createdAt: appUser.createdAt,
    imagePath: appUser.imagePath,
    userName: appUser.userName,
  };

  return responseAppUser;
};
