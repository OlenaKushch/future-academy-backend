import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type CourseWithStudentsCount = Prisma.CourseGetPayload<{
  include: {
    _count: {
      select: { enrolledUsers: true };
    };
  };
}>;

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<CourseWithStudentsCount[]> {
    return this.prisma.course.findMany({
      include: {
        _count: {
          select: {
            enrolledUsers: true,
          },
        },
      },
    });
  }

  async enrollUser(courseId: number, userId: number): Promise<User> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        enrolledCourses: {
          connect: { id: courseId },
        },
      },
      include: {
        _count: {
          select: { enrolledCourses: true },
        },
      },
    });
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
