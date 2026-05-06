import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity.ts';
import { FeatureToggle } from './entities/feature-toggle.entity.ts';
import { User } from '../user/entities/user.entity.ts';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subRepo: Repository<Subscription>,
    @InjectRepository(FeatureToggle)
    private featureRepo: Repository<FeatureToggle>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createCheckoutSession(userId: string, tier: string) {
    // Generate a Stripe Checkout Session here
    return { url: 'https://checkout.stripe.com/pay/cs_test_mock123' };
  }

  async handleWebhook(event: any) {
    // Handle Stripe webhook events (e.g., checkout.session.completed, invoice.payment_succeeded)
    console.log('Webhook received:', event.type);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      // Upgrade user
      await this.userRepo.update(userId, { subscriptionTier: session.metadata.tier });
    }
  }

  // Admin capabilities
  async getAllFeatures() {
    return this.featureRepo.find();
  }

  async setFeatureRequirement(featureKey: string, isPaid: boolean, minimumTierRequired: string) {
    let feature = await this.featureRepo.findOneBy({ featureKey });
    if (!feature) {
      feature = this.featureRepo.create({ featureKey });
    }
    feature.isPaid = isPaid;
    feature.minimumTierRequired = minimumTierRequired;
    return this.featureRepo.save(feature);
  }

  async checkAccess(userId: string, featureKey: string): Promise<boolean> {
    const feature = await this.featureRepo.findOneBy({ featureKey });
    if (!feature || !feature.isPaid) return true; // Default to free if not configured or not paid

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return false;

    if (user.subscriptionTier === 'vip') return true;
    if (user.subscriptionTier === 'premium' && feature.minimumTierRequired === 'premium') return true;

    return false;
  }
}
