import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        products: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Verificar se a categoria existe
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        products: true,
      },
    });
  }

  async remove(id: number) {
    // Verificar se a categoria existe
    await this.findOne(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
