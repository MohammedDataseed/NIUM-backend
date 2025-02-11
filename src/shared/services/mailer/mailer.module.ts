import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService], // ✅ Export MailService so other modules can use it
})
export class MailModule {}
