import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto) {
    return this.prisma.report.create({
      data: createReportDto,
    });
  }

  async findAll() {
    return this.prisma.report.findMany();
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException('Relatório não encontrado');
    }
    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    // Verificar se o relatório existe
    await this.findOne(id);

    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
    });
  }

  async remove(id: number) {
    // Verificar se o relatório existe
    await this.findOne(id);

    return this.prisma.report.delete({
      where: { id },
    });
  }
}
