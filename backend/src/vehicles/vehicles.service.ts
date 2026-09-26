import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SeasonalRate, Vehicle, VehicleDocument, VehicleStatus } from './schemas/vehicle.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehicleDto } from './dto/query-vehicle.dto';
import { Reservation, ReservationDocument, ReservationStatus } from '../reservations/schemas/reservation.schema';
import { VehiclePricingService } from './vehicle-pricing.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    private readonly pricingService: VehiclePricingService,
  ) {}

  async create(dto: CreateVehicleDto) {
    this.pricingService.validatePeriods(dto.seasonalRates as SeasonalRate[] | undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { parcId, parc: _populatedParc, ...rest } = dto as any;
    return this.vehicleModel.create({
      ...rest,
      ...(parcId ? { parc: new Types.ObjectId(parcId) } : {}),
    });
  }

  async findAll(query: QueryVehicleDto) {
    const {
      category, transmission, fuel, status,
      minPrice, maxPrice, seats, ac, gps,
      page = 1, limit = 10, sortBy = 'pricePerDay', sortOrder = 'asc',
      pickupDate, dropoffDate, driverAge, parcId,
    } = query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isActive: true };

    if (category) filter.category = category;
    if (transmission) filter.transmission = transmission;
    if (fuel) filter.fuel = fuel;
    if (status) filter.status = status;
    if (seats) filter.seats = { $gte: seats };
    if (ac !== undefined) filter['features.ac'] = ac;
    if (gps !== undefined) filter['features.gps'] = gps;

    // ── Age filter ──────────────────────────────────────────────────────────────
    // Only show vehicles whose minDriverAge <= driver's age
    if (driverAge !== undefined) {
      filter.minDriverAge = { $lte: driverAge };
    }

    // ── Parc filter ───────────────────────────────────────────────────────────
    // Only show vehicles assigned to the selected parc
    if (parcId) {
      filter.parc = new Types.ObjectId(parcId);
    }
    // ── Availability filter ──────────────────────────────────────────────────
    // Exclude any vehicle that has a pending/confirmed reservation overlapping
    // the requested window.  Overlap condition:
    //   reservation.pickupDate < dropoffDate  AND  reservation.dropoffDate > pickupDate
    if (pickupDate && dropoffDate) {
      const pickup  = new Date(pickupDate);
      const dropoff = new Date(dropoffDate);

      const bookedDocs = await this.reservationModel
        .find({
          status: { $in: [ReservationStatus.CONFIRMED] },
          pickupDate:  { $lt: dropoff },
          dropoffDate: { $gt: pickup },
        })
        .select('vehicle')
        .lean()
        .exec();

      const bookedIds = bookedDocs.map(r => new Types.ObjectId(r.vehicle as any));
      if (bookedIds.length > 0) {
        filter._id = { $nin: bookedIds };
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    if (Boolean(pickupDate) !== Boolean(dropoffDate)) {
      throw new BadRequestException('pickupDate and dropoffDate must be provided together');
    }

    // Seasonal rates are computed values, so price filtering/sorting must happen
    // after each eligible vehicle has been quoted for the requested stay.
    const documents = await this.vehicleModel.find(filter).exec();
    let vehicles = documents.map(document => {
      const pricing = pickupDate && dropoffDate
        ? this.pricingService.quote(document, pickupDate, dropoffDate)
        : this.pricingService.quoteToday(document);
      return { ...document.toObject(), pricing };
    });

    if (minPrice !== undefined) vehicles = vehicles.filter(v => v.pricing.averageDailyRate >= minPrice);
    if (maxPrice !== undefined) vehicles = vehicles.filter(v => v.pricing.averageDailyRate <= maxPrice);

    const direction = sortOrder === 'asc' ? 1 : -1;
    vehicles.sort((a, b) => {
      const left = sortBy === 'pricePerDay' ? a.pricing.averageDailyRate : (a as any)[sortBy];
      const right = sortBy === 'pricePerDay' ? b.pricing.averageDailyRate : (b as any)[sortBy];
      if (typeof left === 'string' && typeof right === 'string') return left.localeCompare(right) * direction;
      return ((Number(left) || 0) - (Number(right) || 0)) * direction;
    });

    const total = vehicles.length;
    const skip = (page - 1) * limit;
    vehicles = vehicles.slice(skip, skip + limit);

    return {
      vehicles,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async getQuote(id: string, pickupDate: string, dropoffDate: string) {
    const vehicle = await this.findOne(id);
    return this.pricingService.quote(vehicle, pickupDate, dropoffDate);
  }

  quoteVehicle(vehicle: Pick<Vehicle, 'pricePerDay' | 'seasonalRates'>, pickupDate: string | Date, dropoffDate: string | Date) {
    return this.pricingService.quote(vehicle, pickupDate, dropoffDate);
  }

  async update(id: string, dto: UpdateVehicleDto) {
    this.pricingService.validatePeriods(dto.seasonalRates as SeasonalRate[] | undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { parcId, parc: _populatedParc, ...rest } = dto as any;
    const update: Record<string, any> = { ...rest };
    if (parcId !== undefined) {
      update.parc = parcId ? new Types.ObjectId(parcId) : null;
    }
    const vehicle = await this.vehicleModel
      .findByIdAndUpdate(id, update, { returnDocument: 'after' })
      .exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async toggleActive(id: string) {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    vehicle.isActive = !vehicle.isActive;
    return vehicle.save();
  }

  async addImage(id: string, imageUrl: string) {
    const vehicle = await this.vehicleModel
      .findByIdAndUpdate(id, { $push: { images: imageUrl } }, { new: true })
      .exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async getAvailability(id: string, startDate: Date, endDate: Date) {
    // Will cross-reference reservations — returns availability status
    const vehicle = await this.findOne(id);
    return {
      vehicleId: id,
      status: vehicle.status,
      isActive: vehicle.isActive,
      requestedRange: { startDate, endDate },
    };
  }

  async remove(id: string) {
    const vehicle = await this.vehicleModel.findByIdAndDelete(id).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return { message: 'Vehicle deleted successfully' };
  }

  // Admin: find all regardless of isActive, with parc populated
  async findAllAdmin() {
    return this.vehicleModel.find().populate('parc', 'name city address').exec();
  }

  // ── Status sync ─────────────────────────────────────────────────────────────
  /**
   * Recomputes the status of a single vehicle from its active reservations.
   * Priority:
   *   1. Maintenance  → manual flag, never overridden here
   *   2. Réservé      → has at least one pending/confirmed reservation whose dropoffDate >= now
   *   3. Disponible   → everything else
   */
  async syncVehicleStatus(vehicleId: string): Promise<void> {
    const vehicle = await this.vehicleModel.findById(vehicleId).exec();
    if (!vehicle) return;

    // Maintenance is a manual override — leave it alone
    if (vehicle.status === VehicleStatus.MAINTENANCE) return;

    const now = new Date();
    const activeRes = await this.reservationModel.findOne({
      vehicle:    vehicleId,
      // Only CONFIRMED reservations lock the vehicle as RESERVE
      status:     { $in: [ReservationStatus.CONFIRMED] },
      dropoffDate:{ $gte: now },   // reservation hasn't ended yet
    }).exec();

    const computed = activeRes ? VehicleStatus.RESERVE : VehicleStatus.DISPONIBLE;
    if (vehicle.status !== computed) {
      await this.vehicleModel.findByIdAndUpdate(vehicleId, { status: computed }).exec();
    }
  }

  /**
   * Re-syncs every non-Maintenance vehicle.
   * Called on server startup and by the periodic cron to catch expired reservations.
   */
  async syncAllVehicleStatuses(): Promise<void> {
    const vehicles = await this.vehicleModel
      .find({ status: { $ne: VehicleStatus.MAINTENANCE } })
      .select('_id')
      .lean()
      .exec();
    await Promise.all(vehicles.map(v => this.syncVehicleStatus(v._id.toString())));
  }

  /**
   * Allows admin to manually set a vehicle into / out of Maintenance.
   * Setting underMaintenance=true  → status = Maintenance
   * Setting underMaintenance=false → triggers syncVehicleStatus to recompute
   */
  async setMaintenance(id: string, enable: boolean): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (enable) {
      vehicle.status = VehicleStatus.MAINTENANCE;
      return vehicle.save();
    } else {
      // Remove maintenance flag, then let sync figure out the real status
      vehicle.status = VehicleStatus.DISPONIBLE; // temporary
      await vehicle.save();
      await this.syncVehicleStatus(id);
      // Vehicle is guaranteed to exist — we just saved it above
      return this.vehicleModel.findById(id).exec() as Promise<VehicleDocument>;
    }
  }
}
