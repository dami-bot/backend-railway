import { Module } from '@nestjs/common';
import { ComprasModule } from './compras/compras.module';
import { ProductosModule } from './productos/productos.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
@Module({
  imports: [
    // Solo los módulos de tu app
    ComprasModule,
    ProductosModule,
    MarketplaceModule,
  ],
  // Prisma disponible para todos los servicios
})
export class AppModule {}
