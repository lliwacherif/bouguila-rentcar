import { BadRequestException, Injectable } from '@nestjs/common';
import { SeasonalRate, Vehicle } from './schemas/vehicle.schema';

const TVA_RATE = 0.19;
const DAY_MS = 86_400_000;

export interface PricingBreakdownLine {
  name: string;
  startDate: string;
  endDate: string;
  days: number;
  pricePerDay: number;
  totalTTC: number;
}

export interface VehicleQuote {
  currency: 'TND';
  totalDays: number;
  calendarDays: number;
  extraDayApplied: boolean;
  minimumDailyRate: number;
  maximumDailyRate: number;
  averageDailyRate: number;
  subtotalHT: number;
  tva: number;
  totalTTC: number;
  breakdown: PricingBreakdownLine[];
}

export interface QuoteTiming {
  pickupTime?: string;
  dropoffTime?: string;
  extraDayIfReturnAfterPickup?: boolean;
}

@Injectable()
export class VehiclePricingService {
  quote(
    vehicle: Pick<Vehicle, 'pricePerDay' | 'seasonalRates'>,
    pickupValue: string | Date,
    dropoffValue: string | Date,
    timing?: QuoteTiming,
  ): VehicleQuote {
    const pickup = this.parseDate(pickupValue, 'pickupDate');
    const dropoff = this.parseDate(dropoffValue, 'dropoffDate');
    const pickupTime = this.normalizeClock(timing?.pickupTime, 'pickupTime');
    const dropoffTime = this.normalizeClock(timing?.dropoffTime, 'dropoffTime');
    const calendarDays = Math.round((dropoff.getTime() - pickup.getTime()) / DAY_MS);
    const returnLater = this.clockMinutes(dropoffTime) > this.clockMinutes(pickupTime);

    if (calendarDays < 0 || (calendarDays === 0 && !returnLater)) {
      throw new BadRequestException('Drop-off must be after pick-up');
    }

    // The extra day is only added on top of a rental that already spans at least one calendar day.
    // A same-day rental is still billed as one day, whether or not the switch is on.
    const extraDayApplied = Boolean(timing?.extraDayIfReturnAfterPickup) && returnLater && calendarDays >= 1;
    const totalDays = Math.max(1, calendarDays + (extraDayApplied ? 1 : 0));
    const billableEnd = new Date(pickup.getTime() + totalDays * DAY_MS);

    const breakdown: PricingBreakdownLine[] = [];
    let totalTTC = 0;
    let minimumDailyRate = Number.POSITIVE_INFINITY;
    let maximumDailyRate = 0;

    for (let cursor = pickup.getTime(); cursor < billableEnd.getTime(); cursor += DAY_MS) {
      const date = new Date(cursor);
      const rate = this.rateForDate(vehicle, date);
      const dateKey = this.toDateKey(date);
      totalTTC += rate.pricePerDay;
      minimumDailyRate = Math.min(minimumDailyRate, rate.pricePerDay);
      maximumDailyRate = Math.max(maximumDailyRate, rate.pricePerDay);

      const previous = breakdown[breakdown.length - 1];
      if (previous && previous.name === rate.name && previous.pricePerDay === rate.pricePerDay) {
        previous.endDate = dateKey;
        previous.days += 1;
        previous.totalTTC = this.money(previous.totalTTC + rate.pricePerDay);
      } else {
        breakdown.push({
          name: rate.name,
          startDate: dateKey,
          endDate: dateKey,
          days: 1,
          pricePerDay: rate.pricePerDay,
          totalTTC: rate.pricePerDay,
        });
      }
    }

    const totalTTCRounded = this.money(totalTTC);
    const subtotalHT = this.money(totalTTCRounded / (1 + TVA_RATE));
    const tva = this.money(totalTTCRounded - subtotalHT);

    return {
      currency: 'TND',
      totalDays,
      calendarDays,
      extraDayApplied,
      minimumDailyRate: this.money(minimumDailyRate),
      maximumDailyRate: this.money(maximumDailyRate),
      averageDailyRate: this.money(totalTTCRounded / totalDays),
      subtotalHT,
      tva,
      totalTTC: totalTTCRounded,
      breakdown,
    };
  }

  quoteToday(vehicle: Pick<Vehicle, 'pricePerDay' | 'seasonalRates'>): VehicleQuote {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: 'Africa/Tunis', year: 'numeric', month: 'numeric', day: 'numeric',
    }).formatToParts(new Date());
    const value = (type: string) => Number(parts.find(part => part.type === type)?.value);
    const pickup = new Date(Date.UTC(value('year'), value('month') - 1, value('day')));
    const dropoff = new Date(pickup.getTime() + DAY_MS);
    return this.quote(vehicle, pickup, dropoff);
  }

  validatePeriods(periods: SeasonalRate[] | undefined): void {
    if (!periods?.length) return;
    if (periods.length > 24) throw new BadRequestException('A maximum of 24 seasonal pricing periods is allowed');

    const occupied = new Map<number, string>();
    for (const period of periods) {
      if (period.enabled === false) continue;
      this.assertCalendarDate(period.startMonth, period.startDay, `${period.name} start date`);
      this.assertCalendarDate(period.endMonth, period.endDay, `${period.name} end date`);
      if (!Number.isFinite(Number(period.pricePerDay)) || Number(period.pricePerDay) <= 0) {
        throw new BadRequestException(`${period.name || 'Seasonal period'} must have a positive daily price`);
      }

      for (const dayKey of this.periodDayKeys(period)) {
        const conflict = occupied.get(dayKey);
        if (conflict) {
          throw new BadRequestException(`Seasonal pricing periods overlap: ${conflict} and ${period.name}`);
        }
        occupied.set(dayKey, period.name);
      }
    }
  }

  private rateForDate(vehicle: Pick<Vehicle, 'pricePerDay' | 'seasonalRates'>, date: Date) {
    const dayKey = (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
    const period = (vehicle.seasonalRates || []).find(item => item.enabled !== false && this.includesDay(item, dayKey));
    return period
      ? { name: period.name, pricePerDay: Number(period.pricePerDay) }
      : { name: 'Tarif standard', pricePerDay: Number(vehicle.pricePerDay) };
  }

  private includesDay(period: SeasonalRate, dayKey: number): boolean {
    const start = period.startMonth * 100 + period.startDay;
    const end = period.endMonth * 100 + period.endDay;
    return start <= end ? dayKey >= start && dayKey <= end : dayKey >= start || dayKey <= end;
  }

  private periodDayKeys(period: SeasonalRate): number[] {
    const keys: number[] = [];
    const startKey = period.startMonth * 100 + period.startDay;
    const endKey = period.endMonth * 100 + period.endDay;
    const wraps = startKey > endKey;
    const startYear = wraps ? 1999 : 2000;
    const start = Date.UTC(startYear, period.startMonth - 1, period.startDay);
    const endYear = 2000;
    const end = Date.UTC(endYear, period.endMonth - 1, period.endDay);
    for (let cursor = start; cursor <= end; cursor += DAY_MS) {
      const date = new Date(cursor);
      keys.push((date.getUTCMonth() + 1) * 100 + date.getUTCDate());
    }
    return keys;
  }

  private assertCalendarDate(month: number, day: number, label: string): void {
    const date = new Date(Date.UTC(2000, Number(month) - 1, Number(day)));
    if (date.getUTCMonth() + 1 !== Number(month) || date.getUTCDate() !== Number(day)) {
      throw new BadRequestException(`${label} is not a valid calendar date`);
    }
  }

  private parseDate(value: string | Date, label: string): Date {
    const key = value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) throw new BadRequestException(`${label} must be a valid date`);
    const [year, month, day] = key.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
      throw new BadRequestException(`${label} must be a valid date`);
    }
    return date;
  }

  private toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private money(value: number): number {
    return Number(value.toFixed(2));
  }

  private normalizeClock(value: string | undefined, label: string): string {
    const time = (value || '10:00').trim();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      throw new BadRequestException(`${label} must be HH:mm`);
    }
    return time;
  }

  private clockMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
