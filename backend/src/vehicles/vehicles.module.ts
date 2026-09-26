import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { Reservation, ReservationSchema } from '../reservations/schemas/reservation.schema';
import { VehicleStatusSyncService } from './vehicle-status-sync.service';
import { VehiclePricingService } from './vehicle-pricing.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [VehiclesService, VehicleStatusSyncService, VehiclePricingService],
  controllers: [VehiclesController],
  exports: [VehiclesService, VehiclePricingService],
})
export class VehiclesModule {}

