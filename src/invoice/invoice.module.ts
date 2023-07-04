import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService, JwtService],
})
export class InvoiceModule {}
