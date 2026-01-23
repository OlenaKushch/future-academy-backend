import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

interface ActiveUserData {
  userId: number;
  email: string;
}

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Post(':id/enroll')
  @UseGuards(AuthGuard('jwt'))
  async enroll(
    @Param('id', ParseIntPipe) courseId: number,
    @GetUser() user: ActiveUserData,
  ) {
    return this.coursesService.enroll(courseId, user.userId);
  }
}
