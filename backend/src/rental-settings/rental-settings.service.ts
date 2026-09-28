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
    return { extraDayIfReturnAfterPickup: Boolean(doc?.extraDayIfReturnAfterPickup) };
  }

  async setExtraDayIfReturnAfterPickup(enabled: boolean) {
    const doc = await this.model.findOneAndUpdate(
      { key: 'rental' },
      { $set: { extraDayIfReturnAfterPickup: enabled }, $setOnInsert: { key: 'rental' } },
      { upsert: true, returnDocument: 'after' },
    ).exec();
    return { extraDayIfReturnAfterPickup: Boolean(doc?.extraDayIfReturnAfterPickup) };
  }
}
