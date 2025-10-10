import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Verificar se o pedido existe
    const order = await this.prisma.order.findUnique({
      where: { id: createPaymentDto.orderId },
    });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createPaymentDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o método de pagamento existe
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id: createPaymentDto.methodId },
    });
    if (!method) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }

    return this.prisma.payment.create({
      data: createPaymentDto,
      include: {
        order: true,
        user: true,
        method: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas pagamentos do usuário
      return this.prisma.payment.findMany({
        where: { userId },
        include: {
          order: true,
          user: true,
          method: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.payment.findMany({
      include: {
        order: true,
        user: true,
        method: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: true,
        user: true,
        method: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    // Se userId fornecido, verificar propriedade
    if (userId && payment.userId !== userId) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto, userId?: number) {
    // Verificar se o pagamento existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se orderId foi fornecido, verificar se existe
    if (updatePaymentDto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: updatePaymentDto.orderId },
      });
      if (!order) {
        throw new NotFoundException('Pedido não encontrado');
      }
    }

    // Se userId foi fornecido, verificar se existe
    if (updatePaymentDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updatePaymentDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    // Se methodId foi fornecido, verificar se existe
    if (updatePaymentDto.methodId) {
      const method = await this.prisma.paymentMethod.findUnique({
        where: { id: updatePaymentDto.methodId },
      });
      if (!method) {
        throw new NotFoundException('Método de pagamento não encontrado');
      }
    }

    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: {
        order: true,
        user: true,
        method: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se o pagamento existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.payment.delete({
      where: { id },
    });
  }
}
