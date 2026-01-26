import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { ActiveUserData } from '../auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@GetUser() user: ActiveUserData) {
    return this.usersService.getProfile(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/courses')
  async getMyCourses(@GetUser() user: ActiveUserData) {
    const profile = await this.usersService.getProfile(user.id);
    if (!profile) {
      return null;
    }
    return profile.enrolledCourses;
  }
}
