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

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas carrinhos do usuário
      return this.prisma.cart.findMany({
        where: { userId },
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
    // Admin pode ver todos
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

  async findOne(id: number, userId?: number) {
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

    // Se userId fornecido, verificar propriedade
    if (userId && cart.userId !== userId) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto, userId?: number) {
    // Verificar se o carrinho existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se userId foi fornecido no DTO, verificar se existe
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

  async remove(id: number, userId?: number) {
    // Verificar se o carrinho existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.cart.delete({
      where: { id },
    });
  }
}
