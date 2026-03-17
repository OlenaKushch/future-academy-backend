import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetCoursesQueryDto } from '../dto/get-courses-query.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetCoursesQueryDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { enrolledUsers: true },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: { enrolledUsers: true },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Курс ${id} не знайдено`);
    }
    return course;
  }
}
