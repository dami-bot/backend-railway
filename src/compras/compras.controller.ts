// src/compras/compras.controller.ts
import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { ComprasService } from './compras.service';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  async crearCompra(@Body() body: any) {
    const { items, cliente, numeroPedido } = body;
    return this.comprasService.crearCompra(items, cliente, numeroPedido);
  }

  @Get()
  async obtenerHistorial() {
    return this.comprasService.obtenerHistorial();
  }

  @Delete()
  async limpiarHistorial() {
    return this.comprasService.limpiarHistorial();
  }
}

