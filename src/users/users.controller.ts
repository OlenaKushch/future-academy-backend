import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { ActiveUserData } from '../common/decorators/get-user.decorator';
import {
  CreatedUserResponseDto,
  UserListItemDto,
  UserProfileResponseDto,
} from './dto/user-response.dto';
import {
  ApiBadRequestErrorResponse,
  ApiConflictErrorResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from '../common/swagger/decorators/api-error-responses.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'List of all users',
    type: UserListItemDto,
    isArray: true,
  })
  @ApiUnauthorizedErrorResponse('Unauthorized', 'Unauthorized')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreatedUserResponseDto,
  })
  @ApiBadRequestErrorResponse('Invalid input data', [
    'email must be an email',
    'password must be longer than or equal to 6 characters',
  ])
  @ApiUnauthorizedErrorResponse('Unauthorized', 'Unauthorized')
  @ApiConflictErrorResponse(
    'User with this email or phone already exists',
    'User with this email or phone already exists',
  )
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserProfileResponseDto,
  })
  @ApiUnauthorizedErrorResponse('Unauthorized', 'Unauthorized')
  @ApiNotFoundErrorResponse('User not found', 'User was not found')
  getProfile(@GetUser() user: ActiveUserData) {
    return this.usersService.getProfile(user.id);
  }
}
