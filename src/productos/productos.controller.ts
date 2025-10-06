import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { v2 as cloudinary } from 'cloudinary';

// Configuración Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('api/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  // CREAR PRODUCTO
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @Body() data: {
      nombre: string;
      descripcion?: string;
      precio: number;
      stock: number;
      ofertaDiaria?: boolean;
      vencimiento?: string | null; // Recibimos como string desde el front
    },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      let uploadedImageUrl: string | undefined = undefined;

      if (file) {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'productos' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          stream.end(file.buffer);
        });

        uploadedImageUrl = result.secure_url;
      }

      return this.productosService.create({
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        stock: Number(data.stock),
        ofertaDiaria: data.ofertaDiaria ?? false,
        vencimiento: data.vencimiento ? new Date(data.vencimiento) : null,
        ...(uploadedImageUrl ? { imagenUrl: uploadedImageUrl } : {}),
      });

    } catch (err) {
      console.error('❌ Error en create producto:', err);
      throw new InternalServerErrorException('No se pudo crear el producto');
    }
  }

  // ACTUALIZAR PRODUCTO
  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  async update(
    @Param('id') id: string,
    @Body() data: {
      nombre?: string;
      descripcion?: string;
      precio?: number;
      stock?: number;
      ofertaDiaria?: boolean;
      vencimiento?: string | null;
    },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      let uploadedImageUrl: string | undefined = undefined;

      if (file) {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'productos' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          stream.end(file.buffer);
        });

        uploadedImageUrl = result.secure_url;
      }

      // Convertir tipos
      const updateData: any = {
        ...data,
        ...(data.precio !== undefined ? { precio: Number(data.precio) } : {}),
        ...(data.stock !== undefined ? { stock: Number(data.stock) } : {}),
        ...(data.vencimiento !== undefined
          ? { vencimiento: data.vencimiento ? new Date(data.vencimiento) : null }
          : {}),
        ...(uploadedImageUrl ? { imagenUrl: uploadedImageUrl } : {}),
      };

      return this.productosService.update(Number(id), updateData);
    } catch (err) {
      console.error('❌ Error en update producto:', err);
      throw new InternalServerErrorException('No se pudo actualizar el producto');
    }
  }

  // ELIMINAR PRODUCTO
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productosService.delete(Number(id));
  }

  // RESTAR STOCK
  @Post(':id/restar-stock')
  async restarStock(
    @Param('id') id: string,
    @Body() body: { cantidad: number },
  ) {
    const cantidad = Number(body.cantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
      throw new BadRequestException('Cantidad inválida');
    }
    return this.productosService.restarStock(Number(id), cantidad);
  }
}
