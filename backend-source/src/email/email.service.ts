import { Injectable } from '@nestjs/common';
import { VerifyEmailTemplate } from './templates/verify-email.template.ts';
import { ResetPasswordTemplate } from './templates/reset-password.template.ts';

@Injectable()
export class EmailService {
  private readonly appUrl = process.env.APP_URL || 'http://localhost:3000';

  async sendVerificationEmail(email: string, name: string, token: string) {
    const htmlMessage = VerifyEmailTemplate(name, token, this.appUrl);
    console.log(`[EmailService] Sending verification email to ${email}`);
    // Replace with AWS SES, SendGrid, or nodemailer logic
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const htmlMessage = ResetPasswordTemplate(name, token, this.appUrl);
    console.log(`[EmailService] Sending password reset email to ${email}`);
    // Replace with AWS SES, SendGrid, or nodemailer logic
  }
}
