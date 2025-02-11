import { Injectable, Inject, NotFoundException, UnauthorizedException,InternalServerErrorException,BadRequestException } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { User } from '../../models/user.model';
import * as opentracing from 'opentracing';
import { TracerService } from '../../../shared/services/tracer/tracer.service';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { MailerService } from 'src/shared/services/mailer/mailer.service';
import { randomBytes } from 'crypto';
import { verify } from 'jsonwebtoken';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
    private readonly tracerService: TracerService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService
  ) {}

  async findAll(span: opentracing.Span, params: WhereOptions<User>): Promise<User[]> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      return await this.userRepository.findAll({ where: params, attributes: { exclude: ['password'] } });
    } finally {
      childSpan.finish();
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(span: opentracing.Span, createUserDto: CreateUserDto): Promise<User> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      return await this.userRepository.create(createUserDto);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      childSpan.finish();
    }
  }

  async updateUser(span: opentracing.Span, id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) throw new NotFoundException('User not found');

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
        if (existingUser) throw new UnauthorizedException('Email is already in use');
      }

      await user.update(updateUserDto);
      return user;
    } finally {
      childSpan.finish();
    }
  }

  async deleteUser(span: opentracing.Span, id: string): Promise<void> {
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });

    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) throw new NotFoundException('User not found');

      await user.destroy();
      childSpan.log({ event: 'user_deleted', userId: id });
    } finally {
      childSpan.finish();
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: User; access_token: string; refresh_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      user,
      access_token: this.jwtService.sign(payload, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '1d' }),
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return {
        access_token: this.jwtService.sign({ email: payload.email, sub: payload.sub }, { expiresIn: '1h' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
      // Generate a reset token valid for 1 hour
    const resetToken = this.jwtService.sign({ email, type: 'reset' }, { expiresIn: '15m' });
    const resetUrl = `https://tayib-jet.vercel.app/reset-password?token=${resetToken}`;
  
    try {
      // Send password reset email
      await this.mailService.sendMail(
        email,
        'Password Reset Request',
        `Click the link to reset your password: ${resetUrl}`,
        `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
      );
  
      return { message: 'Password reset link sent to your email.' };
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }
  
  
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> {
    if (newPassword !== confirmPassword) throw new UnauthorizedException('Passwords do not match');
  
    let payload;
    try {
      payload = verify(token, process.env.JWT_SECRET);
      if (payload.type !== 'reset') throw new UnauthorizedException('Invalid token type');
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  
    const user = await this.userRepository.findOne({ where: { email: payload.email } });
    if (!user) throw new NotFoundException('User not found');
  
    // Hash the new password using bcryptjs
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  
    return { message: 'Password reset successfully.' };
  }
  
  
}
