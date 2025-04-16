import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: parseInt(this.configService.get<string>('MAIL_PORT'), 10),
      secure: this.configService.get<boolean>('MAIL_SECURE') || false, // Use SSL/TLS if needed
      auth: {
        user: this.configService.get<string>('MAIL_FROM'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    } as nodemailer.TransportOptions);
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
      Logger.log(`Message sent: ${info.messageId}`, 'MailerService');

      return info;
    } catch (error) {
      Logger.error(
        `Error sending email: ${error.message}`,
        '',
        'MailerService',
      );

      throw new Error('Failed to send email');
    }
  }
}
