import { Role } from '@prisma/client';

export class CreateAppUserDto {
  id: number;
  createdAt: Date;
  userName: string;
  password: string;
  file: string;
  role?: Role;
}

export class CreateAppUserDtoWithCloudinaryPublicId extends CreateAppUserDto {
  cloudinary_public_id: string;
}


// id: number;
// createdAt: Date;

// // Category

// categoryId: number;

// name: string;

// price: number;

// path: string;

// thumbImagePath: string;

// fullImagePath: string;

// isBestSeller: boolean;

// // reviews

// // discounts Discount[]

// // details ProductDetails[]

// // inventories Inventory[]

// // InvoiceDetails InvoiceDetails[]