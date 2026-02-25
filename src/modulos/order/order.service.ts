import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: orderData.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o endereço existe
    const address = await this.prisma.address.findUnique({
      where: { id: orderData.addressId },
    });
    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    // Se items foram fornecidos, calcular totalAmount a partir dos preços reais do BD
    let totalAmount = orderData.totalAmount ?? 0;
    if (items && items.length > 0) {
      const products = await this.prisma.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
      });

      totalAmount = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
          throw new NotFoundException(
            `Produto ${item.productId} não encontrado`,
          );
        return sum + product.price * item.quantity;
      }, 0);
    }

    return this.prisma.order.create({
      data: {
        userId: orderData.userId!,
        totalAmount,
        status: orderData.status ?? 'pending',
        addressId: orderData.addressId,
        ...(items && items.length > 0
          ? {
              orderItems: {
                create: await Promise.all(
                  items.map(async (item) => {
                    const product = await this.prisma.product.findUnique({
                      where: { id: item.productId },
                    });
                    return {
                      productId: item.productId,
                      quantity: item.quantity,
                      price: product!.price,
                    };
                  }),
                ),
              },
            }
          : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
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
