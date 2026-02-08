import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { PrismaService } from '../prisma/prisma.service'; // Importante para la DB

@Module({
  controllers: [MarketplaceController],
  providers: [MarketplaceService, PrismaService], // Agregamos PrismaService aquí
})
export class MarketplaceModule {}