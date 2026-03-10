import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
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
        name: dto.name,
        password: hashedPassword,
        role: dto.role ?? UserRole.MANAGER,
      },
    });
    //   } catch (error) {
    //     this.logger.error('Error creating user', error);
    //     if (
    //       error instanceof Prisma.PrismaClientKnownRequestError &&
    //       error.code === 'P2002'
    //     ) {
    //       throw new ConflictException('User with this email already exists');
    //     }

    //     throw new InternalServerErrorException();
    //   }
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
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
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
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
      },
    });

    if (!user) throw new NotFoundException('User was not found');

    if (!user.avatar) {
      const nameForAvatar = user.name ? user.name.split(' ').join('+') : 'User';
      user.avatar = `https://ui-avatars.com/api/?name=${nameForAvatar}&background=random`;
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
}
