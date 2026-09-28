import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RentalSettingsDocument = RentalSettings & Document;

@Schema({ timestamps: true })
export class RentalSettings {
  @Prop({ required: true, unique: true, default: 'rental' })
  key: string;

  /** When true, a return clock time later than the pickup clock time adds one billed day. */
  @Prop({ default: false })
  extraDayIfReturnAfterPickup: boolean;
}

export const RentalSettingsSchema = SchemaFactory.createForClass(RentalSettings);
