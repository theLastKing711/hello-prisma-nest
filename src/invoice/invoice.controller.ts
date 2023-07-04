import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    console.log('app user id', createInvoiceDto.appUserId);
    const createdInvoiceModel = await this.invoiceService.create({
      invoiceDetails: {
        createMany: {
          data: {
            productId: 1,
            ProductQuantity: 25,
          },
        },
      },
      appUser: {
        connect: {
          id: 19,
        },
      },
    });

    return createdInvoiceModel;
  }

  @Get()
  async findAll(
    params:
      | {
          skip?: number;
          take?: number;
          cursor?: Prisma.InvoiceWhereUniqueInput;
          where?: Prisma.InvoiceWhereInput;
          orderBy?: Prisma.InvoiceOrderByWithRelationInput;
        }
      | undefined,
  ) {
    const invoiceModels = await this.invoiceService.findAll({});

    // const responseInvoiceServiceDtos = invoiceModels.map((invoice) =>
    // {
    //   transformInvoiceToResponse({
    //     ...invoice,
    //   }),
    // });

    return invoiceModels;
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const invoiceModel = await this.invoiceService.findOne({ id: +id });

  //   if (!invoiceModel) {
  //     throw new HttpException('Invoice was not found', HttpStatus.NOT_FOUND);
  //   }

  //   const responseInvoiceDto = transformInvoiceToResponse({
  //     ...invoiceModel,
  //   });

  //   return responseInvoiceDto;
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateInvoiceDto: UpdateInvoiceDto,
  // ) {
  //   const invoiceModel = await this.invoiceService.findOne({ id: +id });

  //   if (!invoiceModel) {
  //     throw new HttpException('Invoice was not found', HttpStatus.NOT_FOUND);
  //   }

  //   const updatedInvoiceModel = await this.invoiceService.update({
  //     where: {
  //       id: +id,
  //     },
  //     data: {

  //         invoiceDetails: {
  //           updateMany: {
  //             where: {
  //               id: updateInvoiceDto.
  //             }
  //           }
  //         }
  //       },
  //     },
  //   });

  //   return responseInvoiceDto;
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const InvoiceDto = this.invoiceService.findOne({ id: +id });

    if (!InvoiceDto) {
      throw new HttpException('Invoice was not found', HttpStatus.NOT_FOUND);
    }

    return InvoiceDto;
  }
}
