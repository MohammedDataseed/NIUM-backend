import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter;

    constructor(private configService: ConfigService) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<string>('MAIL_PORT'),
        secure: true, // Use SSL
        auth: {
          user: this.configService.get<string>('MAIL_FROM'),
          pass: this.configService.get<string>('MAIL_PASS'),
        },
      });
    }

    async sendMail(to: string, subject: string, text: string, html: string) {
        const mailOptions = {
          from: this.configService.get<string>('MAIL_FROM'),
          to,
          subject,
          text,
          html,
        };

        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log('Message sent: %s', info.messageId);
          return info;
        } catch (error) {
          console.error('Error sending email:', error);
          throw new Error('Failed to send email');
        }
      }
  
}
