import { Module } from '@nestjs/common';
import { ComprasModule } from './compras/compras.module';
import { ProductosModule } from './productos/productos.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    // Solo los módulos de tu app
    ComprasModule,
    ProductosModule,
  ],
  providers: [PrismaService], // Prisma disponible para todos los servicios
})
export class AppModule { }

