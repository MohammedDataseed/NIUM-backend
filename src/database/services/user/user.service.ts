import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/user.model';
import * as opentracing from 'opentracing';
import { WhereOptions } from 'sequelize';
import { TracerService } from '../../../shared/services/tracer/tracer.service';
import { CreateUserDto } from 'src/dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
    private readonly tracerService: TracerService, // Inject TracerService
  ) {}

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<User> // Ensure params match expected type
  ): Promise<User[]> {
   //   // Use TracerService to create a child span
  //   const span = this.tracerService.traceDBOperations(parentSpan, 'findAll', 'User');

    const childSpan = span.tracer().startSpan('db-query', { childOf: span });
    
    try {
      const result = await this.userRepository.findAll({ where: params });
      return result;
    } finally {
      childSpan.finish();
    }
  }

  async createUser(
    parentSpan: opentracing.Span | undefined,
    createUserDto: CreateUserDto
  ): Promise<User> {
    // Create a new tracing span
    const span = this.tracerService.traceDBOperations(parentSpan, 'createUser', 'User');

    try {
      const user = await this.userRepository.create(createUserDto);
      return user;
    } catch (error) {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', message: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }


}
  
