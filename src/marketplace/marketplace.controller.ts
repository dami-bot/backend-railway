import { Param, Controller, Get, Post, Body, Delete, Patch } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) { }

  @Post()
  create(@Body() createDto: any) {
    return this.marketplaceService.create(createDto);
  }

  // 🚀 AGREGAMOS ESTO: Es la ruta que le faltaba a tu formulario para Editar
  @Patch(':id') 
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.marketplaceService.update(+id, updateDto);
  }

  @Patch(':id/vender')
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