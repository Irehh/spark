import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || 'mock',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'mock',
      callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      id: id,
      email: emails && emails.length ? emails[0].value : null,
      name: `${name.givenName} ${name.familyName}`,
      accessToken,
    };
    done(null, user);
  }
}
