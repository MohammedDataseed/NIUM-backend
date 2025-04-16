import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module'; // ✅ Import DatabaseModule
import { UserService } from '../services/v1/user/user.service';
import { SharedModule } from '../shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../shared/services/mailer/mailer.module';
import { MailerService } from '../shared/services/mailer/mailer.service';
@Module({
  imports: [
    ConfigModule, // ✅ Ensure ConfigModule is imported
    DatabaseModule, // ✅ Now UserService is available
    PassportModule,
    SharedModule,
    MailModule, // ✅ Add MailModule to imports

    JwtModule.registerAsync({
      imports: [ConfigModule], // ✅ Import ConfigModule for dependency injection
      inject: [ConfigService], // ✅ Inject ConfigService
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_SECRET_EXPIRE');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return { secret, signOptions: { expiresIn } };
      },
    }),
  ],
  providers: [JwtAuthService, UserService, MailerService], // ✅ Add MailService
  exports: [JwtAuthService, MailerService], // ✅ Export MailService if needed in other modules
})
export class AuthModule {}
