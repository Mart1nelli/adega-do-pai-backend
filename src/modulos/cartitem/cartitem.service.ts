import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';

@Injectable()
export class CartitemService {
  constructor(private prisma: PrismaService) {}

  async create(createCartitemDto: CreateCartitemDto) {
    // Verificar se o carrinho existe
    const cart = await this.prisma.cart.findUnique({
      where: { id: createCartitemDto.cartId },
    });
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createCartitemDto.productId },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.cartItem.create({
      data: createCartitemDto,
      include: {
        cart: true,
        product: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas itens de carrinhos do usuário
      return this.prisma.cartItem.findMany({
        where: {
          cart: {
            userId,
          },
        },
        include: {
          cart: true,
          product: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.cartItem.findMany({
      include: {
        cart: true,
        product: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item do carrinho não encontrado');
    }

    // Se userId fornecido, verificar propriedade através do carrinho
    if (userId && cartItem.cart.userId !== userId) {
      throw new NotFoundException('Item do carrinho não encontrado');
    }

    return cartItem;
  }

  async update(id: number, updateCartitemDto: UpdateCartitemDto, userId?: number) {
    // Verificar se o item do carrinho existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se cartId foi fornecido, verificar se existe
    if (updateCartitemDto.cartId) {
      const cart = await this.prisma.cart.findUnique({
        where: { id: updateCartitemDto.cartId },
      });
      if (!cart) {
        throw new NotFoundException('Carrinho não encontrado');
      }
    }

    // Se productId foi fornecido, verificar se existe
    if (updateCartitemDto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: updateCartitemDto.productId },
      });
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }
    }

    return this.prisma.cartItem.update({
      where: { id },
      data: updateCartitemDto,
      include: {
        cart: true,
        product: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se o item do carrinho existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.cartItem.delete({
      where: { id },
    });
  }
}
