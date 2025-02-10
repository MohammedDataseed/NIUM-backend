// import { Controller, Get, Query } from '@nestjs/common';
// import { UserService } from '../../../database/services/user/user.service';
// import { User } from '../../../database/models/user.model';
// import * as opentracing from 'opentracing';
// import { TracerService } from '../../../shared/services/tracer/tracer.service';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Get()
//   async findAll(@Query() params: object): Promise<User[]> {
//     const tracer = opentracing.globalTracer();
//     const span = tracer.startSpan('find-all-users-request');
//     const result = await this.userService.findAll(span, params);
//     span.finish();
//     return result;
//   }
// }


// import { Controller, Get,Post,Body, Query } from '@nestjs/common';
// import { UserService } from '../../../database/services/user/user.service';
// import { User } from 'src/database/models/user.model';
// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Get()
//   async findAll(@Query() params: object): Promise<any> {
//     try {
//       const result = await this.userService.findAll(params);
//       return result;
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       throw new Error('Something went wrong');  // You can customize this error message
//     }
//   }

//   @Post()
//   async create(@Body() userData: Partial<User>) {
//     return await this.userService.createUser(userData);
//   }
// }

import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { UserService } from "../../../database/services/user/user.service";
import { CreateUserDto } from "src/dto/user.dto";
import { User } from "src/database/models/user.model";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Users") // This groups all the endpoints under the 'Users' tag in Swagger UI
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(@Query() params: object): Promise<any> {
    try {
      const result = await this.userService.findAll(params);
      return result;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw new Error('Something went wrong');  // You can customize this error message
    }
  }

  @Post()
  @ApiOperation({ summary: "Create a new user" }) // Description for the method
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
    type: User, // The User model is returned as a response
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid data provided.",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
