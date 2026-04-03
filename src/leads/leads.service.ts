import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from '../dto/create-lead.dto';
import * as nodemailer from 'nodemailer';
import { AdminLeadsQueryDto } from './dto/admin-leads-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateLeadDto) {
    const course = await this.prisma.course.findUnique({
      where: { uuid: dto.courseId },
      select: { id: true, title: true },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        message: dto.message,
        status: 'NEW',
        course: { connect: { id: course.id } },
      },
    });

    await this.sendLeadEmails({
      userEmail: dto.email,
      userName: dto.name,
      courseTitle: course.title,
      message: dto.message,
      phone: dto.phone,
    });

    return {
      status: 'success',
      leadId: lead.id,
    };
  }

  async findAllForAdmin(userId: number, query: AdminLeadsQueryDto) {
    await this.ensureAdmin(userId);

    const where: Prisma.LeadWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.courseId) {
      if (/^\d+$/.test(query.courseId)) {
        where.courseId = Number(query.courseId);
      } else {
        where.course = { uuid: query.courseId };
      }
    }

    if (query.dateFrom || query.dateTo) {
      const createdAt: Prisma.DateTimeFilter = {};

      if (query.dateFrom) {
        createdAt.gte = new Date(query.dateFrom);
      }

      if (query.dateTo) {
        const parsedDateTo = new Date(query.dateTo);
        const hasTime = query.dateTo.includes('T');

        if (!hasTime) {
          parsedDateTo.setHours(23, 59, 59, 999);
        }

        createdAt.lte = parsedDateTo;
      }

      where.createdAt = createdAt;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
      ];
    }

    return this.prisma.lead.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            uuid: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForAdmin(userId: number, id: string) {
    await this.ensureAdmin(userId);

    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            uuid: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async updateForAdmin(userId: number, id: string, dto: UpdateLeadDto) {
    await this.ensureAdmin(userId);

    if (dto.status === undefined && dto.notes === undefined) {
      throw new BadRequestException('At least one field must be provided');
    }

    const existing = await this.prisma.lead.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.lead.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes,
      },
      include: {
        course: {
          select: {
            id: true,
            uuid: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async deleteForAdmin(userId: number, id: string) {
    await this.ensureAdmin(userId);

    const existing = await this.prisma.lead.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Lead not found');
    }

    await this.prisma.lead.delete({ where: { id } });

    return {
      status: 'success',
      message: 'Lead deleted successfully',
    };
  }

  private async ensureAdmin(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
  }

  private async sendLeadEmails(data: {
    userEmail: string;
    userName: string;
    phone: string;
    courseTitle: string;
    message?: string;
  }) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') ?? 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from = this.configService.get<string>('SMTP_FROM') ?? user;
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const connectionTimeout = Number(
      this.configService.get<string>('SMTP_CONNECTION_TIMEOUT') ?? 10000,
    );
    const socketTimeout = Number(
      this.configService.get<string>('SMTP_SOCKET_TIMEOUT') ?? 30000,
    );

    if (!host || !user || !pass || !from || !adminEmail) {
      this.logger.warn(
        'SMTP or ADMIN_EMAIL is not fully configured. Lead emails were skipped.',
      );
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout,
      socketTimeout,
    });

    try {
      await Promise.all([
        transporter.sendMail({
          from,
          to: adminEmail,
          subject: 'New lead received',
          text: [
            'A new lead has been submitted.',
            `Name: ${data.userName}`,
            `Email: ${data.userEmail}`,
            `Phone: ${data.phone}`,
            `Course: ${data.courseTitle}`,
            `Message: ${data.message ?? '-'}`,
          ].join('\n'),
        }),
        transporter.sendMail({
          from,
          to: data.userEmail,
          subject: 'We received your request',
          text: [
            `Hello, ${data.userName}!`,
            'Thank you for your interest in Future Academy.',
            `We received your lead for course: ${data.courseTitle}.`,
            'Our team will contact you soon.',
          ].join('\n'),
        }),
      ]);
    } catch (error) {
      this.logger.error('Failed to send lead emails', error);
    }
  }
}
