import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalSettings, RentalSettingsSchema } from './rental-settings.schema';
import { RentalSettingsService } from './rental-settings.service';
import { RentalSettingsController } from './rental-settings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RentalSettings.name, schema: RentalSettingsSchema },
    ]),
  ],
  providers: [RentalSettingsService],
  controllers: [RentalSettingsController],
  exports: [RentalSettingsService],
})
export class RentalSettingsModule {}
