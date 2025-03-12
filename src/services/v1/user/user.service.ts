import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { WhereOptions } from "sequelize";
import { User } from "../../../database/models/user.model";
import { Role } from "src/database/models/role.model";
import { Branch } from "src/database/models/branch.model";
import { bank_account } from "src/database/models/bank_account.model";
import * as opentracing from "opentracing";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { CreateUserDto, UpdateUserDto } from "src/dto/user.dto";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "src/dto/login.dto";
import { MailerService } from "src/shared/services/mailer/mailer.service";
import { verify } from "jsonwebtoken";

export interface UserCreationResponse {
  message: string;
  user: User;
}

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_REPOSITORY")
    private readonly userRepository: typeof User,
    @Inject("BRANCH_REPOSITORY")
    private readonly branchRepository: typeof Branch,
    @Inject("ROLE_REPOSITORY")
    private readonly roleRepository: typeof Role,
    @Inject("BANK_ACCOUNT_REPOSITORY")
    private readonly bankAccountRepository: typeof bank_account,
    private readonly tracerService: TracerService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService
  ) {}
  

  // async createUser(span: opentracing.Span, createUserDto: CreateUserDto, jwt: string): Promise<any> {
  //   const childSpan = span.tracer().startSpan("db-query", { childOf: span });
  
  //   // // Decode JWT and extract role
  //   // let decodedToken;
  //   // try {
  //   //   decodedToken = this.jwtService.verify(jwt);
  //   // } catch (error) {
  //   //   throw new UnauthorizedException('Invalid or expired token');
  //   // }
  
  //   // // Check if the user has the role of "admin" or "co-admin"
  //   // const userRole = decodedToken.role;
  //   // if (!(userRole === 'admin' || userRole === 'co-admin')) {
  //   //   throw new HttpException('Unauthorized to create user', HttpStatus.FORBIDDEN);
  //   // }
  
  //   const existingUser = await this.userRepository.findOne({
  //     where: { email: createUserDto.email },
  //   });
  
  //   // If the email already exists, throw a conflict error
  //   if (existingUser) {
  //     throw new HttpException('Email already exists', HttpStatus.CONFLICT);
  //   }
  
  //   try {
  //     // Hash the password
  //     createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
  
  //     // Generate a hashed_key for the user
  //     const hashedKey = crypto.createHash("sha256").update(createUserDto.email).digest("hex");
    
  //     // Create the user in the database
  //     const user = await this.userRepository.create({
  //       ...createUserDto,
  //       hashed_key: hashedKey,
  //       role_id: createUserDto.role_id,
  //       branch_id: createUserDto.branch_id,
  //       bank_account_id: createUserDto.bank_account_id,
  //     });
  
  //     // Return the success message along with the user details
  //     return {
  //       message: "User added successfully",
  //       user,
  //     };
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   } finally {
  //     childSpan.finish();
  //   }
  // }

  async createUser(span: opentracing.Span, createUserDto: CreateUserDto): Promise<any> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });
  
    const { email, role_id, branch_id, bank_account_id } = createUserDto;
  
    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
  
    // ✅ Check if role_id exists
    const roleExists = await this.roleRepository.findOne({ where: { hashed_key: role_id } });
    if (!roleExists) {
      throw new HttpException('Invalid role_id', HttpStatus.BAD_REQUEST);
    }
  
    // ✅ Check if branch_id exists
    const branchExists = await this.branchRepository.findOne({ where: { hashed_key: branch_id } });
    if (!branchExists) {
      throw new HttpException('Invalid branch_id', HttpStatus.BAD_REQUEST);
    }
  
    // ✅ Check if bank_account_id exists (if provided)
    if (bank_account_id) {
      const bankAccountExists = await this.bankAccountRepository.findOne({ where: { hashed_key: bank_account_id } });
      if (!bankAccountExists) {
        throw new HttpException('Invalid bank_account_id', HttpStatus.BAD_REQUEST);
      }
    }
  
    try {
      // Hash the password
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
  
      // Generate a hashed_key for the user
      const hashedKey = crypto.createHash("sha256").update(email).digest("hex");
  
      // Create the user in the database
      const user = await this.userRepository.create({
        ...createUserDto,
        hashed_key: hashedKey,
      });
  
      return {
        message: "User added successfully",
        user,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      childSpan.finish();
    }
  }
  

  
  async updateUser(
    span: opentracing.Span,
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });

    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) throw new NotFoundException("User not found");

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingUser)
          throw new UnauthorizedException("Email is already in use");
      }

      await user.update(updateUserDto);
      return user;
    } finally {
      childSpan.finish();
    }
  }

  async deleteUser(span: opentracing.Span, id: string): Promise<void> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });

    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) throw new NotFoundException("User not found");

      await user.destroy();
      childSpan.log({ event: "user_deleted", userId: id });
    } finally {
      childSpan.finish();
    }
  }

  async login(loginDto: LoginDto): Promise<{
    user: Partial<User>;
    access_token: string;
    refresh_token: string;
  }> {
    const { email, password } = loginDto;
  
    // Fetch the user and include role in the query
    const user = await this.userRepository.findOne({
      where: { email },
      attributes: { exclude: ["role_id", "branch_id", "bank_account_id"] }, // Do NOT exclude password
      include: [
        { model: Role, as: "role", attributes: ["id", "name"] }, // Make sure role is included
        { model: Branch, as: "branch", attributes: ["id", "name"] },
        {
          model: bank_account,
          as: "bank_account",
          attributes: [
            "id",
            "account_number",
            "ifsc_code",
            "bank_name",
            "bank_branch",
          ],
        },
      ],
    });
  
    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials");
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
  
    // Include role in the JWT payload (either admin or co-admin)
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role.name // Add the role here
    };
  
    // 🔹 Convert Sequelize instance to plain object and remove password
    const safeUser = user.get({ plain: true });
    delete safeUser.password;
  
    return {
      user: safeUser, // Return user object without password
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d",
      }),
    };
  }
  

  async findAll(
    span: opentracing.Span,
    params: WhereOptions<User>
  ): Promise<User[]> {
    const childSpan = span.tracer().startSpan("db-query", { childOf: span });
  
    try {
      return await this.userRepository.findAll({
        where: params,
        attributes: { exclude: ["password"] },
        include: [
          { model: Role, as: "role", attributes: ["id", "name"] },
          { model: Branch, as: "branch", attributes: ["id", "name"] },
          {
            model: bank_account,
            as: "bank_account",
            attributes: ["id", "account_number", "ifsc_code", "bank_name", "bank_branch"],
          },
        ],
      });
    } finally {
      childSpan.finish();
    }
  }
  

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  
  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return {
        access_token: this.jwtService.sign(
          { email: payload.email, sub: payload.sub },
          { expiresIn: "1h" }
        ),
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Generate a reset token valid for 1 hour
    const resetToken = this.jwtService.sign(
      { email, type: "reset" },
      { expiresIn: "15m" }
    );
    const resetUrl = `https://nium-forex-agent-portal.vercel.app/reset-password?token=${resetToken}`;

    try {
      // Send password reset email
      await this.mailService.sendMail(
        email,
        "Password Reset Request",
        `Click the link to reset your password: ${resetUrl}`,
        `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
      );

      return { message: "Password reset link sent to your email." };
    } catch (error) {
      console.error("Error sending reset email:", error);
      throw new InternalServerErrorException(
        "Failed to send password reset email"
      );
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    if (newPassword !== confirmPassword)
      throw new UnauthorizedException("Passwords do not match");

    let payload;
    try {
      payload = verify(token, process.env.JWT_SECRET);
      if (payload.type !== "reset")
        throw new UnauthorizedException("Invalid token type");
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (!user) throw new NotFoundException("User not found");

    // Hash the new password using bcryptjs
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password reset successfully." };
  }
}
