import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const recaptchaToken = request.headers['x-recaptcha-token'];

    if (!recaptchaToken) {
      // Allow development environments to bypass bot control if strictly necessary, but block normally
      if (process.env.NODE_ENV !== 'production') return true;
      throw new BadRequestException('reCAPTCHA token missing - suspected bot activity');
    }

    const isValid = await this.verifyRecaptcha(recaptchaToken);
    if (!isValid) {
      throw new BadRequestException('Invalid reCAPTCHA token');
    }

    return true;
  }

  private async verifyRecaptcha(token: string): Promise<boolean> {
    // Implement Google reCAPTCHA Verification API call here
    // e.g., axios.post('https://www.google.com/recaptcha/api/siteverify', { secret: process.env.RECAPTCHA_SECRET, response: token });
    return token !== 'invalid_mock_token';
  }
}
