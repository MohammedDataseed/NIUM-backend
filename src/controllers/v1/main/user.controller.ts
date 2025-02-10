import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { UserService } from "../../../database/services/user/user.service";
import { User } from "../../../database/models/user.model";
import * as opentracing from "opentracing";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { WhereOptions } from "sequelize";
import { CreateUserDto } from "src/dto/user.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";


@ApiTags('Users')
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // async findAll(@Query() params: object): Promise<User[]> {
  async findAll(@Query() params: Record<string, any>): Promise<User[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-all-users-request");
    const whereCondition: WhereOptions<User> = params as WhereOptions<User>;
    const result = await this.userService.findAll(span, whereCondition);
    // const result = await this.userService.findAll(span, params);
    span.finish();
    return result;
  }

  @Post()
@ApiOperation({ summary: "Create a new user" })
@ApiResponse({
  status: 201,
  description: "The user has been successfully created.",
  type: User,
})
@ApiResponse({
  status: 400,
  description: "Bad Request - Invalid data provided.",
})
async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  const tracer = opentracing.globalTracer();
  const span = tracer.startSpan("create-user-request");

  try {
    return await this.userService.createUser(span, createUserDto);
  } finally {
    span.finish();
  }
}

}
