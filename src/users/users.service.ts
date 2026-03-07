import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: dto.email }, { phone: dto.phone }],
        },
      });
      if (existingUser) {
        throw new ConflictException(
          'User with this email or phone already exists',
        );
      }
      const hashedPassword: string = await bcrypt.hash(dto.password, 10);

      return await this.prisma.user.create({
        data: {
          email: dto.email,
          phone: dto.phone,
          name: dto.name,
          password: hashedPassword,
        },
      });
    } catch (error) {
      this.logger.error('Error creating user', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User with this email already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByEmailOrPhone(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async changePassword(userId: number, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        enrolledCourses: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true,
          },
        },
        _count: {
          select: { enrolledCourses: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User was not found');

    if (!user.avatar) {
      const nameForAvatar = user.name ? user.name.split(' ').join('+') : 'User';
      user.avatar = `https://ui-avatars.com/api/?name=${nameForAvatar}&background=random`;
    }

    return user;
  }
  async getMyCourses(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        enrolledCourses: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
