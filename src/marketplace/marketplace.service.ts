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

  // marketplace.service.ts

// Reemplaza tu método update por este:
async update(id: number, data: any) {
  const precioBase = data.precioBase ? Number(data.precioBase) : undefined;
  let updateData = { ...data };

  // Si el precioBase cambió, recalculamos comision y precio final
  if (precioBase !== undefined) {
    const porcentajeComision = 0.10;
    const comisionMonto = precioBase * porcentajeComision;
    const precioFinal = precioBase + comisionMonto;
    
    updateData = {
      ...updateData,
      precioBase: precioBase,
      precioFinal: precioFinal,
      comisionMonto: comisionMonto,
    };
  }

  // Convertimos stock a número si viene en el data
  if (data.stock) updateData.stock = Number(data.stock);

  return this.prisma.marketplaceItem.update({
    where: { id: Number(id) },
    data: updateData,
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