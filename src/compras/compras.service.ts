// src/compras/compras.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComprasService {
  constructor(private prisma: PrismaService) {}

  async crearCompra(data: any) {
  return this.prisma.purchase.create({
    data: {
      numeroPedido: data.numeroPedido,
      cliente: data.cliente,
      direccion: data.direccion,
      total: data.total,
      items: data.items,
    },
  });
}


  async obtenerHistorial() {
    return this.prisma.purchase.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async limpiarHistorial() {
    return this.prisma.purchase.deleteMany();
  }
}

