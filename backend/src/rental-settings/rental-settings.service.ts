import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalSettings, RentalSettingsDocument } from './rental-settings.schema';

@Injectable()
export class RentalSettingsService {
  constructor(
    @InjectModel(RentalSettings.name)
    private readonly model: Model<RentalSettingsDocument>,
  ) {}

  async get() {
    const doc = await this.model.findOne({ key: 'rental' }).exec();
    return {
      extraDayIfReturnAfterPickup: Boolean(doc?.extraDayIfReturnAfterPickup),
      stampFeeEnabled: Boolean(doc?.stampFeeEnabled),
    };
  }

  async update(patch: { extraDayIfReturnAfterPickup?: boolean; stampFeeEnabled?: boolean }) {
    const $set: Record<string, boolean> = {};
    if (patch.extraDayIfReturnAfterPickup !== undefined) $set.extraDayIfReturnAfterPickup = patch.extraDayIfReturnAfterPickup;
    if (patch.stampFeeEnabled !== undefined) $set.stampFeeEnabled = patch.stampFeeEnabled;
    const doc = await this.model.findOneAndUpdate(
      { key: 'rental' },
      { $set, $setOnInsert: { key: 'rental' } },
      { upsert: true, returnDocument: 'after' },
    ).exec();
    return {
      extraDayIfReturnAfterPickup: Boolean(doc?.extraDayIfReturnAfterPickup),
      stampFeeEnabled: Boolean(doc?.stampFeeEnabled),
    };
  }
}
