import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailTemplate } from './templates/verify-email.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class EmailService {
  private readonly appUrl: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const htmlMessage = VerifyEmailTemplate(name, token, this.appUrl);
    this.logger.log(`Sending verification email to ${email}`);
    
    try {
      if (this.configService.get('SMTP_USER')) {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Verify your email address',
          html: htmlMessage,
        });
        this.logger.log(`Verification email sent successfully to ${email}`);
      } else {
        this.logger.warn(`SMTP credentials not configured. Email to ${email} not sent. Body: ${htmlMessage}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const htmlMessage = ResetPasswordTemplate(name, token, this.appUrl);
    this.logger.log(`Sending password reset email to ${email}`);
    
    try {
      if (this.configService.get('SMTP_USER')) {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Reset your password',
          html: htmlMessage,
        });
        this.logger.log(`Password reset email sent successfully to ${email}`);
      } else {
        this.logger.warn(`SMTP credentials not configured. Email to ${email} not sent. Body: ${htmlMessage}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
    }
  }
}
