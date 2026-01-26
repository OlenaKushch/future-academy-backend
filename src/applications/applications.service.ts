import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number | undefined, dto: CreateApplicationDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const data: Prisma.CourseApplicationCreateInput = {
      userName: dto.userName,
      phone: dto.phone,
      comment: dto.comment,
      status: 'PENDING',
      course: {
        connect: { id: dto.courseId },
      },
    };

    if (userId) {
      data.user = {
        connect: { id: userId },
      };
    }

    try {
      return await this.prisma.courseApplication.create({
        data,
        include: {
          course: {
            select: { title: true },
          },
        },
      });
    } catch (error) {
      console.error('Помилка при створенні заявки:', error);
      throw new BadRequestException('Could not create application');
    }
  }
}
