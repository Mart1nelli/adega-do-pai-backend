import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createNotificationDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.notification.create({
      data: createNotificationDto,
      include: {
        user: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas notificações do usuário
      return this.prisma.notification.findMany({
        where: { userId },
        include: {
          user: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.notification.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    // Se userId fornecido, verificar propriedade
    if (userId && notification.userId !== userId) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return notification;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
    userId?: number,
  ) {
    // Verificar se a notificação existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se userId foi fornecido, verificar se existe
    if (updateNotificationDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateNotificationDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se a notificação existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
