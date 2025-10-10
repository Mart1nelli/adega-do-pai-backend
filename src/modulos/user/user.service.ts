import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
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

  async findOne(id: number, currentUserId?: number, currentUserRole?: string) {
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

    // Se não é admin, verificar se está acessando o próprio perfil
    if (currentUserRole !== 'admin' && currentUserId && user.id !== currentUserId) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUserId?: number, currentUserRole?: string) {
    // Verificar se o usuário existe e se tem permissão para editar
    await this.findOne(id, currentUserId, currentUserRole);

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

  async remove(id: number, currentUserId?: number, currentUserRole?: string) {
    // Verificar se o usuário existe e se tem permissão para deletar
    await this.findOne(id, currentUserId, currentUserRole);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
