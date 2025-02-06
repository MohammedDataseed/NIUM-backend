// import { Injectable, Inject } from '@nestjs/common';
// import { User } from '../../models/user.model';
// import * as opentracing from 'opentracing';
// import { TracerService } from '../../../shared/services/tracer/tracer.service';

// @Injectable()
// export class UserService {
//   constructor(
//     @Inject('USER_REPOSITORY')
//     private readonly userRepository: typeof User,
//     private tracerService: TracerService,
//   ) {}

//   async findAll(
//     parentSpan: opentracing.Span,
//     params: object,
//   ): Promise<User[]> {
//     const span = this.tracerService.traceDBOperations(
//       parentSpan,
//       'findall',
//       User.tableName,
//     );
//     try {
//       const result = await this.userRepository.findAll(params);
//       this.tracerService.finishSpanWithResult(span, 200, null);
//       return result;
//     } catch (err) {
//       // Log the error before throwing
//       console.error('Error in UserService.findAll:', err);
//       this.tracerService.finishSpanWithResult(span, null, true);
//       throw err;
//     }
//   }
  
// }


import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
  ) {}

  async findAll(params: object): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll(params);
      return users;
    } catch (err) {
      console.error('Error in UserService.findAll:', err);  // Log detailed error
      throw new Error('Database fetch failed');  // Custom error message
    }
  }

  // async createUser(userData: Partial<User>): Promise<User> {
  //   try {
  //     const user = await this.userRepository.create(userData);
  //     return user;
  //   } catch (err) {
  //     console.error('Error in UserService.createUser:', err);  // Log detailed error
  //     throw new Error('User creation failed');  // Custom error message
  //   }
  // }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = await this.userRepository.create(userData);
      return user;
    } catch (err) {
      console.error('Error in UserService.createUser:', err);  // Log the entire error
      throw new Error(`User creation failed: ${err.message || 'Unknown error'}`);  // Provide more error details
    }
  }
  
}
