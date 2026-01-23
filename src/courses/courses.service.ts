import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type CourseWithStudentsCount = Prisma.CourseGetPayload<{
  include: {
    _count: {
      select: { students: true };
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
            students: true,
          },
        },
      },
    });
  }

  async enroll(courseId: number, userId: number): Promise<User> {
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
        enrolledCourses: true,
      },
    });
  }
}
