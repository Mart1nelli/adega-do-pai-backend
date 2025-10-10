import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto) {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createAddressDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.address.create({
      data: createAddressDto,
      include: {
        user: true,
      },
    });
  }

  async findAll(userId?: number) {
    if (userId) {
      // Se userId fornecido, retorna apenas endereços do usuário
      return this.prisma.address.findMany({
        where: { userId },
        include: {
          user: true,
        },
      });
    }
    // Admin pode ver todos
    return this.prisma.address.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const address = await this.prisma.address.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    // Se userId fornecido, verificar propriedade
    if (userId && address.userId !== userId) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, userId?: number) {
    // Verificar se o endereço existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    // Se userId foi fornecido no DTO, verificar se existe
    if (updateAddressDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateAddressDto.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    // Verificar se o endereço existe e pertence ao usuário (se userId fornecido)
    await this.findOne(id, userId);

    return this.prisma.address.delete({
      where: { id },
    });
  }
}
