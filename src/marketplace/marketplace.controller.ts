import { Param } from '@nestjs/common';
import { Controller, Get, Post, Body, Delete, Patch } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) { }

  @Post()
  create(@Body() createDto: any) {
    // Aquí es donde recibimos el nombre, precioBase, vendedor, etc.
    return this.marketplaceService.create(createDto);
  }
  // marketplace.controller.ts
  @Patch(':id/vender') // Usamos PATCH porque solo actualizamos un pedacito del objeto
  vender(@Param('id') id: string) {
    return this.marketplaceService.markAsSold(+id);
  }

  @Patch(':id/reactivar')
  reactivar(@Param('id') id: string) {
    return this.marketplaceService.reactivarProducto(+id);
  }

  @Get()
  findAll() {
    return this.marketplaceService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketplaceService.remove(+id);
  }

}
