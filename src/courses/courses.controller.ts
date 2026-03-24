import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { GetCoursesQueryDto } from '../dto/get-courses-query.dto';
import {
  ApiBadRequestErrorResponse,
  ApiNotFoundErrorResponse,
} from '../common/swagger/decorators/api-error-responses.decorator';

@ApiTags('courses')
@Controller('api/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all courses with pagination and search (Public)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'JavaScript',
  })
  @ApiOkResponse({
    description: 'List of courses',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              uuid: {
                type: 'string',
                example: '9dd4f06c-1d3f-428c-97f9-bd98a191d55a',
              },
              title: { type: 'string', example: 'Frontend Kids' },
              slug: { type: 'string', example: 'frontend-kids' },
              description: {
                type: 'string',
                example: 'Practical frontend course for beginners.',
              },
              content: {
                type: 'string',
                nullable: true,
                example: 'Module 1: HTML\nModule 2: CSS\nModule 3: JavaScript',
              },
              image: {
                type: 'string',
                nullable: true,
                example:
                  'https://cdn.future-academy.com/courses/frontend-kids.jpg',
              },
              price: { type: 'number', example: 4999 },
              isActive: { type: 'boolean', example: true },
              minAge: { type: 'number', example: 8 },
              maxAge: { type: 'number', example: 16 },
              level: { type: 'string', example: 'Новачок' },
              type: { type: 'string', example: 'Курс' },
              duration: { type: 'number', example: 3 },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-03-24T10:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-03-24T10:00:00.000Z',
              },
              _count: {
                type: 'object',
                properties: {
                  enrolledUsers: { type: 'number', example: 12 },
                },
              },
            },
          },
        },
        total: { type: 'number', example: 30 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 3 },
      },
    },
  })
  @ApiBadRequestErrorResponse('Invalid query parameters', [
    'page must not be less than 1',
    'limit must not be greater than 100',
  ])
  async findAll(@Query() query: GetCoursesQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course by ID (Public)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Course details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        uuid: {
          type: 'string',
          example: '9dd4f06c-1d3f-428c-97f9-bd98a191d55a',
        },
        title: { type: 'string', example: 'Frontend Kids' },
        slug: { type: 'string', example: 'frontend-kids' },
        description: {
          type: 'string',
          example: 'Practical frontend course for beginners.',
        },
        content: {
          type: 'string',
          nullable: true,
          example: 'Module 1: HTML\nModule 2: CSS\nModule 3: JavaScript',
        },
        image: {
          type: 'string',
          nullable: true,
          example: 'https://cdn.future-academy.com/courses/frontend-kids.jpg',
        },
        price: { type: 'number', example: 4999 },
        isActive: { type: 'boolean', example: true },
        minAge: { type: 'number', example: 8 },
        maxAge: { type: 'number', example: 16 },
        level: { type: 'string', example: 'Новачок' },
        type: { type: 'string', example: 'Курс' },
        duration: { type: 'number', example: 3 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2026-03-24T10:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2026-03-24T10:00:00.000Z',
        },
        _count: {
          type: 'object',
          properties: {
            enrolledUsers: { type: 'number', example: 12 },
          },
        },
      },
    },
  })
  @ApiBadRequestErrorResponse(
    'Course id must be a number',
    'Validation failed (numeric string is expected)',
  )
  @ApiNotFoundErrorResponse('Course not found', 'Курс 1 не знайдено')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }
}
