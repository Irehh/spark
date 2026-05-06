import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../user/entities/user.entity.ts';
import { EmailService } from '../email/email.service.ts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'isVerified'] 
    });
    
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      if (!user.isVerified) {
        throw new UnauthorizedException('Please verify your email first.');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    };
  }

  async register(userData: Partial<User>) {
    const existing = await this.userRepository.findOneBy({ email: userData.email });
    if (existing) throw new BadRequestException('Email already in use.');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      verificationToken
    });
    
    await this.userRepository.save(user);

    // Send async email
    this.emailService.sendVerificationEmail(user.email, user.fullName, verificationToken);

    return { message: 'Registration successful. Please check your email to verify.' };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOneBy({ verificationToken: token });
    if (!user) throw new BadRequestException('Invalid or expired token.');

    user.isVerified = true;
    user.verificationToken = null;
    await this.userRepository.save(user);
    return { message: 'Email verified successfully.' };
  }

  async resendVerification(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user || user.isVerified) throw new BadRequestException('Account not found or already verified.');

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await this.userRepository.save(user);

    this.emailService.sendVerificationEmail(user.email, user.fullName, verificationToken);
    return { message: 'Verification email resent.' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return { message: 'If the email exists, a reset link has been sent.' }; // Generic message for security

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepository.save(user);

    this.emailService.sendPasswordResetEmail(user.email, user.fullName, resetToken);
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token }
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully.' };
  }

  async oauthLogin(provider: string, profile: any) {
    let user = await this.userRepository.findOne({ where: [{ email: profile.email }, { googleId: profile.id }, { facebookId: profile.id }]});

    if (!user) {
      user = this.userRepository.create({
        email: profile.email,
        fullName: profile.name,
        isVerified: true, // OAuth is already verified
      });

      if (provider === 'google') user.googleId = profile.id;
      if (provider === 'facebook') user.facebookId = profile.id;
      
      await this.userRepository.save(user);
    } else {
      // Link account if not already linked
      if (provider === 'google' && !user.googleId) {
        user.googleId = profile.id;
        await this.userRepository.save(user);
      }
      if (provider === 'facebook' && !user.facebookId) {
        user.facebookId = profile.id;
        await this.userRepository.save(user);
      }
    }

    return this.login(user);
  }
}
