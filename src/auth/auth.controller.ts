import { Body, Controller, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { SuccessMessage } from '../common/decorators/success-message.decorator';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SuccessMessage('Login successful')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'JWT token returned successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcxMTI3MDAwMCwiZXhwIjoxNzExMjczNjAwfQ.signature',
          description: 'JWT access token for authenticated requests',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong email or password',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Wrong email or password' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }
}
