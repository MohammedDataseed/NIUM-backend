import { UseGuards, Controller, Get, Post,Put,Delete, Body,Param, Query } from "@nestjs/common";
import { UserService } from "../../../database/services/user/user.service";
import { User } from "../../../database/models/user.model";
import * as opentracing from "opentracing";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { WhereOptions } from "sequelize";
import { CreateUserDto, UpdateUserDto } from "../../../dto/user.dto";
import { ApiTags, ApiOperation, ApiResponse,ApiBody,ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "../../../auth/jwt.guard";
import { LoginDto } from "src/dto/login.dto";

@ApiTags("Users")
@Controller("users")
@ApiBearerAuth('access_token') // 🔹 Must match the name used in Swagger setup
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard) // ✅ Protect endpoint

  @Get()
  async findAll(@Query() params: Record<string, any>): Promise<User[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-all-users-request");
    const whereCondition: WhereOptions<User> = params as WhereOptions<User>;
    const result = await this.userService.findAll(span, whereCondition);
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

  @Put(':id')
@ApiOperation({ summary: 'Update a user' })
@ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: User })
@ApiResponse({ status: 400, description: 'Bad Request - Invalid data provided.' })
@ApiResponse({ status: 404, description: 'User not found.' })
@ApiBody({ type: UpdateUserDto }) // ✅ Ensure Swagger shows request body
async update(
  @Param('id') id: string,
  @Body() updateUserDto: Partial<UpdateUserDto>
): Promise<User> {
  const tracer = opentracing.globalTracer();
  const span = tracer.startSpan('update-user-request');

  try {
    return await this.userService.updateUser(span, id, updateUserDto);
  } finally {
    span.finish();
  }
}

@Delete(':id')
@ApiOperation({ summary: 'Delete a user' })
@ApiResponse({ status: 200, description: 'User successfully deleted.' })
@ApiResponse({ status: 404, description: 'User not found.' })
async delete(@Param('id') id: string): Promise<{ message: string }> {
  const tracer = opentracing.globalTracer();
  const span = tracer.startSpan('delete-user-request');

  try {
    await this.userService.deleteUser(span, id);
    return { message: 'User  deleted successfully' };
  } finally {
    span.finish();
  }
}


  @Post("login") // ✅ Login Route
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "User logged in successfully" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get("email")
  @ApiOperation({ summary: "Find user by email" })
  @ApiResponse({ status: 200, description: "User found", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  async findByEmail(@Query("email") email: string): Promise<User> {
    return await this.userService.findByEmail(email);
  }

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
async refreshToken(@Body('refresh_token') refreshToken: string): Promise<{ access_token: string }> {
  return await this.userService.refreshToken(refreshToken);
}

}
