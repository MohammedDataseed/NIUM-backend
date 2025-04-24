import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module'; // ✅ Import DatabaseModule
import { SharedModule } from '../shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../shared/services/mailer/mailer.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Ensure ConfigModule is imported
    DatabaseModule, // ✅ Now UserService is available
    PassportModule,
    SharedModule,
    MailModule, // ✅ Add MailModule to imports
    JwtModule.registerAsync({
      imports: [ConfigModule], // ✅ Import ConfigModule for dependency injection
      inject: [ConfigService], // ✅ Inject ConfigService
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JWT_SECRET:', secret);
        const expiresIn = configService.get<string>('JWT_SECRET_EXPIRE');
        console.log('JWT_SECRET:', expiresIn);
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return { secret, signOptions: { expiresIn } };
      },
    }),
  ],
  providers: [JwtAuthService, JwtService], // ✅ Add MailService
  exports: [JwtAuthService, JwtService], // ✅ Export MailService if needed in other modules
})
export class AuthModule {}
