import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createReviewDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createReviewDto.productId },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.review.create({
      data: createReviewDto,
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas avaliações do usuário
      return this.prisma.review.findMany({
        where: { userId },
        include: {
          user: true,
          product: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.review.findMany({
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Se userId fornecido, verificar propriedade
    if (userId && review.userId !== userId) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId?: number) {
    // Verificar se a avaliação existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se userId foi fornecido, verificar se existe
    if (updateReviewDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateReviewDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    // Se productId foi fornecido, verificar se existe
    if (updateReviewDto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: updateReviewDto.productId },
      });
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: true,
        product: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se a avaliação existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
