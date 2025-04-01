import {
  UseGuards,
  Controller,
  Headers,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import {
  UserService,
  UserCreationResponse,
} from '../../../services/v1/user/user.service';
import { User } from '../../../database/models/user.model';
import * as opentracing from 'opentracing';
import { WhereOptions } from 'sequelize';
import {
  CreateUserDto,
  UpdateUserDto,
  SendEmailDto,
} from '../../../dto/user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/jwt.guard';
import { LoginDto } from 'src/dto/login.dto';
import { MailerService } from 'src/shared/services/mailer/mailer.service';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access_token') // 🔹 Must match the name used in Swagger setup
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailerService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Query() params: Record<string, any>): Promise<User[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('find-all-users-request');
    const whereCondition: WhereOptions<User> = params as WhereOptions<User>;
    const result = await this.userService.findAll(span, whereCondition);
    span.finish();
    return result;
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers('Authorization') authHeader: string, // Extract Authorization header
  ): Promise<UserCreationResponse> {
    // Ensure the return type matches the custom response
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('create-user-request');
    const token = authHeader?.replace('Bearer ', ''); // Remove 'Bearer ' prefix from token
    if (!token) {
      throw new UnauthorizedException(
        'Authorization token is missing or invalid',
      );
    }
    try {
      return await this.userService.createUser(span, createUserDto, token);
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: UpdateUserDto }) // ✅ Ensure Swagger shows request body
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('update-user-request');

    try {
      return await this.userService.updateUser(span, id, updateUserDto);
    } finally {
      span.finish();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan('delete-user-request');

    try {
      await this.userService.deleteUser(span, id);
      return { message: 'User deleted successfully' };
    } finally {
      span.finish();
    }
  }

  @Post('login') // ✅ Login Route
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(JwtGuard)
  @Get('email')
  @ApiOperation({ summary: 'Find user by email' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByEmail(@Query('email') email: string): Promise<User> {
    return await this.userService.findByEmail(email);
  }

  @UseGuards(JwtGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string', example: 'your_refresh_token_here' },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({ status: 200, description: 'New access token generated' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
  ): Promise<{ access_token: string }> {
    return await this.userService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset link sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    return await this.userService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'your_reset_token_here' },
        newPassword: { type: 'string', example: 'NewSecurePassword123!' },
        confirmPassword: { type: 'string', example: 'NewSecurePassword123!' },
      },
      required: ['token', 'newPassword', 'confirmPassword'],
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Passwords do not match' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
  ): Promise<{ message: string }> {
    return await this.userService.resetPassword(
      token,
      newPassword,
      confirmPassword,
    );
  }

  @UseGuards(JwtGuard)
  @Post('send-email')
  @ApiOperation({
    summary: 'Send an email',
    description: 'Sends an email to the specified recipient.',
  })
  @ApiBody({
    type: SendEmailDto,
    description: 'Email details required to send an email',
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Failed to send email' })
  async sendEmail(@Body() body: SendEmailDto) {
    const { to, subject, text, html } = body;
    try {
      const result = await this.mailService.sendMail(to, subject, text, html);
      return { message: 'Email sent successfully', result };
    } catch (error) {
      return { message: 'Failed to send email', error: error.message };
    }
  }
}
