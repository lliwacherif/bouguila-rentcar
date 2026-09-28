import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { IsBoolean, IsOptional } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RentalSettingsService } from './rental-settings.service';

class UpdateRentalSettingsDto {
  @IsOptional() @IsBoolean()
  extraDayIfReturnAfterPickup?: boolean;

  @IsOptional() @IsBoolean()
  stampFeeEnabled?: boolean;
}

@Controller('settings/rental')
export class RentalSettingsController {
  constructor(private readonly settings: RentalSettingsService) {}

  @Get()
  get() {
    return this.settings.get();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Body() dto: UpdateRentalSettingsDto) {
    return this.settings.update(dto);
  }
}
