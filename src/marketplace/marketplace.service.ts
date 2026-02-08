import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const porcentajeComision = 0.10; // Tu 10%
    const precioBase = Number(data.precioBase);

    // Cálculos automáticos
    const comisionMonto = precioBase * porcentajeComision;
    const precioFinal = precioBase + comisionMonto;

    return this.prisma.marketplaceItem.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioBase: precioBase,
        precioFinal: precioFinal, // Lo que paga el comprador
        comisionMonto: comisionMonto, // Tu ganancia
        stock: Number(data.stock) || 1,
        imagen: data.imagen,
        categoria: data.categoria,
        vendedorNombre: data.vendedorNombre,
        vendedorTelefono: data.vendedorTelefono,
        estado: 'disponible',
      },
    });
  }
  async reactivarProducto(id: number) {
  return this.prisma.marketplaceItem.update({
    where: { id },
    data: { estado: 'disponible' }, // Lo volvemos a poner disponible
  });
}
  async remove(id: number) {
    return this.prisma.marketplaceItem.delete({
      where: { id },
    });
  }
 

  async findAll() {
    return this.prisma.marketplaceItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Para cuando se venda el producto
  async markAsSold(id: number) {
    return this.prisma.marketplaceItem.update({
      where: { id },
      data: { estado: 'vendido' }
    });
  }
}