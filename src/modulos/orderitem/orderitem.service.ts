import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';

@Injectable()
export class OrderitemService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderitemDto: CreateOrderitemDto) {
    // Verificar se o pedido existe
    const order = await this.prisma.order.findUnique({
      where: { id: createOrderitemDto.orderId },
    });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createOrderitemDto.productId },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.orderItem.create({
      data: createOrderitemDto,
      include: {
        order: true,
        product: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas itens de pedidos do usuário
      return this.prisma.orderItem.findMany({
        where: {
          order: {
            userId,
          },
        },
        include: {
          order: true,
          product: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException('Item do pedido não encontrado');
    }

    // Se userId fornecido, verificar propriedade através do pedido
    if (userId && orderItem.order.userId !== userId) {
      throw new NotFoundException('Item do pedido não encontrado');
    }

    return orderItem;
  }

  async update(
    id: number,
    updateOrderitemDto: UpdateOrderitemDto,
    userId?: number,
  ) {
    // Verificar se o item do pedido existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se orderId foi fornecido, verificar se existe
    if (updateOrderitemDto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: updateOrderitemDto.orderId },
      });
      if (!order) {
        throw new NotFoundException('Pedido não encontrado');
      }
    }

    // Se productId foi fornecido, verificar se existe
    if (updateOrderitemDto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: updateOrderitemDto.productId },
      });
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }
    }

    return this.prisma.orderItem.update({
      where: { id },
      data: updateOrderitemDto,
      include: {
        order: true,
        product: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se o item do pedido existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.orderItem.delete({
      where: { id },
    });
  }
}
