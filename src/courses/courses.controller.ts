import {
  Controller,
  Get,
  // Post,
  Param,
  Query,
  ParseIntPipe,
  // UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { GetCoursesQueryDto } from '../dto/get-courses-query.dto';
/* import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

interface ActiveUserData {
  userId: number;
  email: string;
} */

@ApiTags('courses')
@Controller('api/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination and search (Public)' })
  @ApiResponse({
    status: 200,
    description: 'List of courses',
  })
  async findAll(@Query() query: GetCoursesQueryDto) {
    return this.coursesService.findAll(query);
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
  @ApiOperation({ summary: 'Get a single course by ID (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Course details',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }
}
