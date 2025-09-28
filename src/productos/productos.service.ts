import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const productos = await this.prisma.producto.findMany();
      console.log('Productos encontrados:', productos);
      return productos;
    } catch (error) {
      console.error('❌ Error en findAll():', error.message);
      throw new BadRequestException('Error al obtener productos');
    }
  }

  async create(data: {
    nombre: string;
    descripcion?: string;
    stock: number;
    precio: number;
    imagenUrl?: string;
  }) {
    if (!data.nombre || isNaN(data.precio) || isNaN(data.stock)) {
      throw new BadRequestException('Datos inválidos para crear producto');
    }

    let uploadedImageUrl: string | null = null;
    if (data.imagenUrl) {
      try {
        const result = await cloudinary.uploader.upload(data.imagenUrl, {
          folder: 'productos',
        });
        uploadedImageUrl = result.secure_url;
      } catch (err) {
        console.error('❌ Error subiendo imagen a Cloudinary:', err);
        throw new BadRequestException('No se pudo subir la imagen');
      }
    }

    return this.prisma.producto.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: data.precio,
        stock: data.stock,
        imagenUrl: uploadedImageUrl,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      nombre: string;
      descripcion: string;
      precio: number;
      stock: number;
      imagenUrl: string;
    }>
  ) {
    let uploadedImageUrl: string | undefined = undefined;
    if (data.imagenUrl) {
      try {
        const result = await cloudinary.uploader.upload(data.imagenUrl, {
          folder: 'productos',
        });
        uploadedImageUrl = result.secure_url;
      } catch (err) {
        console.error('❌ Error subiendo imagen a Cloudinary:', err);
        throw new BadRequestException('No se pudo subir la imagen');
      }
    }

    return this.prisma.producto.update({
      where: { id },
      data: {
        ...data,
        ...(uploadedImageUrl ? { imagenUrl: uploadedImageUrl } : {}),
      },
    });
  }

  async delete(id: number) {
    return this.prisma.producto.delete({ where: { id } });
  }

  async restarStock(id: number, cantidad: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto || producto.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }
    return this.prisma.producto.update({
      where: { id },
      data: { stock: producto.stock - cantidad },
    });
  }
}
