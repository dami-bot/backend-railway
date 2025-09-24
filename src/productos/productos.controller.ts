import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('api/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    let imageUrl = '';

    if (file) {
      try {
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'productos' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          uploadStream.end(file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (err) {
        console.error('Error subiendo imagen a Cloudinary:', err);
        throw new BadRequestException('No se pudo subir la imagen');
      }
    }

    return this.productosService.create({
      nombre: body.nombre,
      stock: Number(body.stock),
      precio: Number(body.precio),
      imageUrl,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) cb(null, true);
      else cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP.'), false);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const updateData: any = {
      nombre: body.nombre,
      stock: Number(body.stock),
      precio: Number(body.precio),
    };

    if (file) {
      try {
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'productos' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          uploadStream.end(file.buffer);
        });
        updateData.imageUrl = result.secure_url;
      } catch (err) {
        console.error('Error subiendo imagen a Cloudinary:', err);
        throw new BadRequestException('No se pudo subir la imagen');
      }
    }

    return this.productosService.update(Number(id), updateData);
  }

  @Post(':id/restar-stock')
  async restarStock(@Param('id') id: string, @Body('cantidad') cantidad: number) {
    return this.productosService.restarStock(Number(id), cantidad);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productosService.delete(Number(id));
  }
}

