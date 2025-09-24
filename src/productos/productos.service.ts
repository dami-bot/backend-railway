import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) { } // ✅ inyectado

  async findAll() {
    try {
      const productos = await this.prisma.product.findMany();
      console.log('Productos encontrados:', productos);
      return productos;
    } catch (error) {
      console.error('❌ Error en findAll():', error.message);
      throw new BadRequestException('Error al obtener productos');
    }
  }

  async create(data: { name: string; stock: number; price: number; imageUrl?: string; }) {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async restarStock(id: number, cantidad: number) {
    const producto = await this.prisma.product.findUnique({ where: { id } });
    if (!producto || producto.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }
    return this.prisma.product.update({ where: { id }, data: { stock: producto.stock - cantidad } });
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}

