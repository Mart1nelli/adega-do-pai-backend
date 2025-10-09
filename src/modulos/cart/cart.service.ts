import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createCartDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.cart.create({
      data: createCartDto,
      include: {
        user: true,
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.cart.findMany({
      include: {
        user: true,
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        user: true,
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    // Verificar se o carrinho existe
    await this.findOne(id);

    // Se userId foi fornecido, verificar se existe
    if (updateCartDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateCartDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    return this.prisma.cart.update({
      where: { id },
      data: updateCartDto,
      include: {
        user: true,
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    // Verificar se o carrinho existe
    await this.findOne(id);

    return this.prisma.cart.delete({
      where: { id },
    });
  }
}
