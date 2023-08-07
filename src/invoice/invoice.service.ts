import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ResponseInvoiceDto } from './dto/response.invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.InvoiceCreateInput) {
    return this.prisma.invoice.create({
      data,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        invoiceDetails: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.InvoiceWhereUniqueInput;
    where?: Prisma.InvoiceWhereInput;
    orderBy?: Prisma.InvoiceOrderByWithRelationInput;
  }): Promise<ResponseInvoiceDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const invoiceDtos = await this.prisma.invoice.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        invoiceDetails: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return invoiceDtos;
  }

  async findOne(
    invoiceWhereUniqueInput: Prisma.InvoiceWhereUniqueInput,
  ): Promise<ResponseInvoiceDto | null> {
    const invoiceModel = await this.prisma.invoice.findUnique({
      where: invoiceWhereUniqueInput,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        invoiceDetails: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!invoiceModel) {
      return null;
    }

    return invoiceModel;
  }

  async update(params: {
    where: Prisma.InvoiceWhereUniqueInput;
    data: Prisma.InvoiceUpdateInput;
  }): Promise<ResponseInvoiceDto> {
    const { where, data } = params;

    return this.prisma.invoice.update({
      data,
      where,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        invoiceDetails: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(
    where: Prisma.InvoiceWhereUniqueInput,
  ): Promise<ResponseInvoiceDto> {
    return this.prisma.invoice.delete({
      where,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        invoiceDetails: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }
}
