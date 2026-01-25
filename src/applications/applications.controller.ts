import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from 'src/dto/create-application.dto';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(@Req() req: RequestWithUser, @Body() dto: CreateApplicationDto) {
    const userId = req.user?.userId;

    return this.applicationsService.create(userId, dto);
  }
}
