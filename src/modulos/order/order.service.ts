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

  async findAll() {
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

  async findOne(id: number) {
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
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // Verificar se o pedido existe
    await this.findOne(id);

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

  async remove(id: number) {
    // Verificar se o pedido existe
    await this.findOne(id);

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
