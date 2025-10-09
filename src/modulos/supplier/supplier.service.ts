import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: createSupplierDto,
      include: {
        products: true,
      },
    });
  }

  async findAll() {
    return this.prisma.supplier.findMany({
      include: {
        products: true,
      },
    });
  }

  async findOne(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    // Verificar se o fornecedor existe
    await this.findOne(id);

    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
      include: {
        products: true,
      },
    });
  }

  async remove(id: number) {
    // Verificar se o fornecedor existe
    await this.findOne(id);

    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
