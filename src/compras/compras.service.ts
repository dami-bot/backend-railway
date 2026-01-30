import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComprasService {
  constructor(private prisma: PrismaService) {}

  async crearCompra(data: {
    cliente: string;
    direccion: string;
    items: { id: number; nombre: string; precio: number; cantidad: number }[];
  }) {
    // 1. Calcular total automáticamente
    const total = data.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // 2. Iniciamos una transacción para que si algo falla, no se rompa la lógica
    return this.prisma.$transaction(async (tx) => {
      
      // --- PASO A: DESCONTAR STOCK ---
      for (const item of data.items) {
        // Buscamos el producto actual para verificar stock
        const producto = await tx.producto.findUnique({
          where: { id: item.id },
        });

        if (!producto) {
          throw new BadRequestException(`El producto con ID ${item.id} no existe.`);
        }

        if (producto.stock < item.cantidad) {
          throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`);
        }

        // Restamos el stock
        await tx.producto.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.cantidad,
            },
          },
        });
      }

      // --- PASO B: GENERAR NÚMERO DE PEDIDO ---
      const ultimoPedido = await tx.purchase.findFirst({
        orderBy: { numeroPedido: 'desc' },
      });
      const numeroPedido = ultimoPedido ? ultimoPedido.numeroPedido + 1 : 1;

      // --- PASO C: REGISTRAR LA COMPRA ---
      return tx.purchase.create({
        data: {
          cliente: data.cliente,
          direccion: data.direccion,
          numeroPedido,
          total,
          items: data.items as any, // Cast para evitar errores de tipo con Json
        },
      });
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