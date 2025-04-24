// src/services/v1/user/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { SharedModule } from '../../../shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // Add this
import { MailerService } from '../../../shared/services/mailer/mailer.service';
import { TracerService } from '../../../shared/services/tracer/tracer.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ secret: 'test-secret' }), // Add this
      ],
      providers: [
        UserService,
        TracerService,
        MailerService,
        {
          provide: 'USER_REPOSITORY',
          useValue: {}, // Mock repository
        },
        {
          provide: 'BRANCH_REPOSITORY',
          useValue: {}, // Mock repository
        },
        {
          provide: 'ROLE_REPOSITORY',
          useValue: {}, // Mock repository
        },
        {
          provide: 'BANK_ACCOUNT_REPOSITORY',
          useValue: {}, // Mock repository
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
