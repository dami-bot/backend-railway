import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';

@Controller('api/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  // ✅ Ahora recibimos un archivo en lugar de imagenUrl por JSON
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @Body() body: { 
      nombre: string; 
      descripcion?: string; 
      precio: number; 
      stock: number; 
    },
    @UploadedFile() file?: Express.Multer.File
  ) {
    const { nombre, descripcion, precio, stock } = body;

    if (!nombre || isNaN(Number(precio)) || isNaN(Number(stock))) {
      throw new BadRequestException('Datos inválidos para crear producto');
    }

    return this.productosService.create({
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
    }, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  async update(
    @Param('id') id: string,
    @Body() body: { 
      nombre?: string; 
      descripcion?: string; 
      precio?: number; 
      stock?: number; 
    },
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.productosService.update(Number(id), body, file);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productosService.delete(Number(id));
  }

  @Post(':id/restar-stock')
  async restarStock(
    @Param('id') id: string,
    @Body() body: { cantidad: number }
  ) {
    const cantidad = Number(body.cantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
      throw new BadRequestException('Cantidad inválida');
    }
    return this.productosService.restarStock(Number(id), cantidad);
  }
}
