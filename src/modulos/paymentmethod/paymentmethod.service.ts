import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentmethodDto } from './dto/create-paymentmethod.dto';
import { UpdatePaymentmethodDto } from './dto/update-paymentmethod.dto';

@Injectable()
export class PaymentmethodService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentmethodDto: CreatePaymentmethodDto) {
    return this.prisma.paymentMethod.create({
      data: createPaymentmethodDto,
      include: {
        payments: true,
      },
    });
  }

  async findAll() {
    return this.prisma.paymentMethod.findMany({
      include: {
        payments: true,
      },
    });
  }

  async findOne(id: number) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });
    if (!paymentMethod) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }
    return paymentMethod;
  }

  async update(id: number, updatePaymentmethodDto: UpdatePaymentmethodDto) {
    // Verificar se o método de pagamento existe
    await this.findOne(id);

    return this.prisma.paymentMethod.update({
      where: { id },
      data: updatePaymentmethodDto,
      include: {
        payments: true,
      },
    });
  }

  async remove(id: number) {
    // Verificar se o método de pagamento existe
    await this.findOne(id);

    return this.prisma.paymentMethod.delete({
      where: { id },
    });
  }
}
