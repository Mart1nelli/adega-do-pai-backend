import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockhistoryDto } from './dto/create-stockhistory.dto';
import { UpdateStockhistoryDto } from './dto/update-stockhistory.dto';

@Injectable()
export class StockhistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createStockhistoryDto: CreateStockhistoryDto) {
    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createStockhistoryDto.productId },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.stockHistory.create({
      data: createStockhistoryDto,
      include: {
        product: true,
      },
    });
  }

  async findAll() {
    return this.prisma.stockHistory.findMany({
      include: {
        product: true,
      },
    });
  }

  async findOne(id: number) {
    const stockHistory = await this.prisma.stockHistory.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!stockHistory) {
      throw new NotFoundException('Histórico de estoque não encontrado');
    }
    return stockHistory;
  }

  async update(id: number, updateStockhistoryDto: UpdateStockhistoryDto) {
    // Verificar se o histórico de estoque existe
    await this.findOne(id);

    // Se productId foi fornecido, verificar se existe
    if (updateStockhistoryDto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: updateStockhistoryDto.productId },
      });
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }
    }

    return this.prisma.stockHistory.update({
      where: { id },
      data: updateStockhistoryDto,
      include: {
        product: true,
      },
    });
  }

  async remove(id: number) {
    // Verificar se o histórico de estoque existe
    await this.findOne(id);

    return this.prisma.stockHistory.delete({
      where: { id },
    });
  }
}
