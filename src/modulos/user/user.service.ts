import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        addresses: true,
        orders: true,
        carts: true,
        reviews: true,
        notifications: true,
        payments: true,
        orderReviews: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        addresses: true,
        orders: true,
        carts: true,
        reviews: true,
        notifications: true,
        payments: true,
        orderReviews: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: true,
        carts: true,
        reviews: true,
        notifications: true,
        payments: true,
        orderReviews: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Verificar se o usuário existe
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        addresses: true,
        orders: true,
        carts: true,
        reviews: true,
        notifications: true,
        payments: true,
        orderReviews: true,
      },
    });
  }

  async remove(id: number) {
    // Verificar se o usuário existe
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
