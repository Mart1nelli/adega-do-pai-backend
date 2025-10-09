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

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    // Verificar se a notificação existe
    await this.findOne(id);

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

  async remove(id: number) {
    // Verificar se a notificação existe
    await this.findOne(id);

    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
