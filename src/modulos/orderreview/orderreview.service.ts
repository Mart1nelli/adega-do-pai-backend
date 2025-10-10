import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderreviewDto } from './dto/create-orderreview.dto';
import { UpdateOrderreviewDto } from './dto/update-orderreview.dto';

@Injectable()
export class OrderreviewService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderreviewDto: CreateOrderreviewDto) {
    // Verificar se o pedido existe
    const order = await this.prisma.order.findUnique({
      where: { id: createOrderreviewDto.orderId },
    });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createOrderreviewDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.orderReview.create({
      data: createOrderreviewDto,
      include: {
        order: true,
        user: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas avaliações do usuário
      return this.prisma.orderReview.findMany({
        where: { userId },
        include: {
          order: true,
          user: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.orderReview.findMany({
      include: {
        order: true,
        user: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const orderReview = await this.prisma.orderReview.findUnique({
      where: { id },
      include: {
        order: true,
        user: true,
      },
    });

    if (!orderReview) {
      throw new NotFoundException('Avaliação do pedido não encontrada');
    }

    // Se userId fornecido, verificar propriedade
    if (userId && orderReview.userId !== userId) {
      throw new NotFoundException('Avaliação do pedido não encontrada');
    }

    return orderReview;
  }

  async update(id: number, updateOrderreviewDto: UpdateOrderreviewDto, userId?: number) {
    // Verificar se a avaliação do pedido existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se orderId foi fornecido, verificar se existe
    if (updateOrderreviewDto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: updateOrderreviewDto.orderId },
      });
      if (!order) {
        throw new NotFoundException('Pedido não encontrado');
      }
    }

    // Se userId foi fornecido, verificar se existe
    if (updateOrderreviewDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateOrderreviewDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    return this.prisma.orderReview.update({
      where: { id },
      data: updateOrderreviewDto,
      include: {
        order: true,
        user: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se a avaliação do pedido existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.orderReview.delete({
      where: { id },
    });
  }
}
