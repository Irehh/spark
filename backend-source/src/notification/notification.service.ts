import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.ts';

@Injectable()
export class NotificationService {
  
  async sendPushNotification(user: User, title: string, body: string, data?: any) {
    if (user.pushToken) {
      console.log(`[PUSH] To User ${user.id} via token ${user.pushToken}: ${title} - ${body}`);
      // Actual Integration with Firebase Cloud Messaging (FCM) or OneSignal would go here:
      // await firebaseAdmin.messaging().send({ token: user.pushToken, notification: { title, body }, data });
    } else {
      console.log(`[PUSH FAILED] User ${user.id} has no valid pushToken. Title: ${title}`);
    }
  }

  async sendEmail(email: string, subject: string, template: string) {
    console.log(`[EMAIL] To ${email}: ${subject}`);
    // Integration with SendGrid or AWS SES would go here
  }
}
