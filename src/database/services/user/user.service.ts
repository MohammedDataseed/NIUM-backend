import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { User } from '../../models/user.model';
import * as opentracing from 'opentracing';
import { TracerService } from '../../../shared/services/tracer/tracer.service';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from 'src/dto/login.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
    private readonly tracerService: TracerService, // Inject TracerService
    private readonly jwtService: JwtService,
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<User> // Ensure params match expected type
  ): Promise<User[]> {
   //   // Use TracerService to create a child span
  //   const span = this.tracerService.traceDBOperations(parentSpan, 'findAll', 'User');

    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    
    try {
      const result = await this.userRepository.findAll({ where: params,    attributes: { exclude: ['password'] }, });
      return result;
    } finally {
      childSpan.finish();
    }
  }

    // Find user by email
    async findByEmail(email: string): Promise<User> {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
    
    async createUser(    
      span: opentracing.Span,
      createUserDto: CreateUserDto
    ): Promise<User> {
      // If parentSpan is undefined, create a new span
      // const span = parentSpan
      //   ? this.tracerService.traceDBOperations(parentSpan, 'createUser', 'User')
      //   : this.tracerService.tracer.startSpan('createUser');
      
    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    
      try {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userRepository.create(createUserDto);
        console.log('Created User:', user); // Debug output
        return user;
      } catch (error) {
        console.error('Error creating user:', error);
         throw error;
      } finally {
        childSpan.finish();
      }
    }

    async updateUser(
      span: opentracing.Span,
      id: string,
      updateUserDto: UpdateUserDto
    ): Promise<User> {
      const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    
      try {
        const user = await this.userRepository.findByPk(id);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        // Check if the email is being updated and already exists
        if (updateUserDto.email && updateUserDto.email !== user.email) {
          const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
          if (existingUser) {
            throw new UnauthorizedException('Email is already in use');
          }
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
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        await user.destroy();
        childSpan.log({ event: 'user_deleted', userId: id });
      } finally {
        childSpan.finish();
      }
    }
    
    
  async login(loginDto: LoginDto): Promise<{ user: User; access_token: string;refresh_token: string }> {
  const { email, password } = loginDto;

  // Find the user by email
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Generate JWT token
  // Generate access & refresh tokens
  const payload = { email: user.email, sub: user.id };
  const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
  const refresh_token = this.jwtService.sign(payload, { expiresIn: '1d' });

  return { user,access_token, refresh_token };
}

async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
  try {
    const payload = this.jwtService.verify(refreshToken); // ✅ Verify refresh token
    const newAccessToken = this.jwtService.sign({ email: payload.email, sub: payload.sub }, { expiresIn: '1h' });

    return { access_token: newAccessToken };
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }
}

}
  
