// src/compras/compras.controller.ts
import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { ComprasService } from './compras.service';

@Controller('api/compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}
@Post()
async crearCompra(@Body() data: any) {
  return this.comprasService.crearCompra(data);
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

