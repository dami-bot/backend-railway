import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const productos = await this.prisma.producto.findMany();
      console.log('Productos encontrados:', productos);
      return productos;
    } catch (error) {
      console.error('❌ Error en findAll():', error.message);
      throw new BadRequestException('Error al obtener productos');
    }
  }

  async create(data: {
    nombre: string;
    stock: number;
    precio: number;
    imageUrl?: string;
  }) {
    return this.prisma.producto.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.producto.update({ where: { id }, data });
  }

  async restarStock(id: number, cantidad: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto || producto.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }
    return this.prisma.producto.update({
      where: { id },
      data: { stock: producto.stock - cantidad },
    });
  }

  async delete(id: number) {
    return this.prisma.producto.delete({ where: { id } });
  }
}
