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

  async findAll() {
    return this.prisma.address.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const address = await this.prisma.address.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    // Verificar se o endereço existe
    await this.findOne(id);

    // Se userId foi fornecido, verificar se existe
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

  async remove(id: number) {
    // Verificar se o endereço existe
    await this.findOne(id);

    return this.prisma.address.delete({
      where: { id },
    });
  }
}
