import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Verificar se a categoria existe
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se o fornecedor existe
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: createProductDto.supplierId },
    });
    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado');
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
        reviews: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        reviews: true,
        stockHistory: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Verificar se o produto existe
    await this.findOne(id);

    // Se categoryId foi fornecido, verificar se existe
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    // Se supplierId foi fornecido, verificar se existe
    if (updateProductDto.supplierId) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: updateProductDto.supplierId },
      });
      if (!supplier) {
        throw new NotFoundException('Fornecedor não encontrado');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async remove(id: number) {
    // Verificar se o produto existe
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
