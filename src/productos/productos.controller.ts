import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('api/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // GET /api/productos → devuelve todos los productos
  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  // POST /api/productos → crea un producto nuevo
  @Post()
  async create(
    @Body() body: { 
      nombre: string; 
      descripcion?: string; 
      precio: number; 
      stock: number; 
      imagenUrl?: string; // URL o Base64 de la imagen
    }
  ) {
    const { nombre, descripcion, precio, stock, imagenUrl } = body;

    if (!nombre || isNaN(precio) || isNaN(stock)) {
      throw new BadRequestException('Datos inválidos para crear producto');
    }

    return this.productosService.create({
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      imagenUrl, // se pasa al servicio para subir a Cloudinary
    });
  }

  // PUT /api/productos/:id → actualiza un producto existente
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { 
      nombre?: string; 
      descripcion?: string; 
      precio?: number; 
      stock?: number; 
      imagenUrl?: string; 
    }
  ) {
    const data: any = {};
    if (body.nombre) data.nombre = body.nombre;
    if (body.descripcion) data.descripcion = body.descripcion;
    if (body.precio !== undefined) data.precio = Number(body.precio);
    if (body.stock !== undefined) data.stock = Number(body.stock);
    if (body.imagenUrl) data.imagenUrl = body.imagenUrl;

    return this.productosService.update(Number(id), data);
  }

  // DELETE /api/productos/:id → elimina un producto
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productosService.delete(Number(id));
  }

  // POST /api/productos/:id/restar-stock → restar stock
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
