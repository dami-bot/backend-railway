// src/compras/compras.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComprasService {
  constructor(private prisma: PrismaService) {}

  async crearCompra(data: {
    cliente: string;
    direccion: string;
    items: { id: number; nombre: string; precio: number; cantidad: number }[];
  }) {
    // Calcular total automáticamente
    const total = data.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Generar número de pedido secuencial
    const ultimoPedido = await this.prisma.purchase.findFirst({
      orderBy: { numeroPedido: 'desc' },
    });
    const numeroPedido = ultimoPedido ? ultimoPedido.numeroPedido + 1 : 1;

    return this.prisma.purchase.create({
      data: {
        cliente: data.cliente,
        direccion: data.direccion,
        numeroPedido,
        total,
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
