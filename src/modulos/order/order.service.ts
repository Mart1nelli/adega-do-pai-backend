import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createOrderDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o endereço existe
    const address = await this.prisma.address.findUnique({
      where: { id: createOrderDto.addressId },
    });
    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return this.prisma.order.create({
      data: createOrderDto,
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas pedidos do usuário
      return this.prisma.order.findMany({
        where: { userId },
        include: {
          user: true,
          address: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          payments: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.order.findMany({
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Se userId fornecido, verificar propriedade
    if (userId && order.userId !== userId) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userId?: number) {
    // Verificar se o pedido existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se userId foi fornecido, verificar se existe
    if (updateOrderDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateOrderDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    // Se addressId foi fornecido, verificar se existe
    if (updateOrderDto.addressId) {
      const address = await this.prisma.address.findUnique({
        where: { id: updateOrderDto.addressId },
      });
      if (!address) {
        throw new NotFoundException('Endereço não encontrado');
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se o pedido existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
