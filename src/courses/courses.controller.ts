import {
  Controller,
  Get,
  // Post,
  Param,
  // UseGuards,
  // ParseIntPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
/* import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

interface ActiveUserData {
  userId: number;
  email: string;
} */

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  /*   @Post(':id/enroll')
  @UseGuards(AuthGuard('jwt'))
  async enrollUser(
    @Param('id', ParseIntPipe) courseId: number,
    @GetUser() user: ActiveUserData,
  ) {
    return this.coursesService.enrollUser(courseId, user.userId);
  }
 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }
}
