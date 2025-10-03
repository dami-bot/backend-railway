import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
 

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

 

  const allowedOrigins = [
    'http://localhost:3000',
     process.env.FRONTEND_URL || 'https://sistema-de-inventario-qb65rve37-dami-bots-projects.vercel.app'];
  // 🌍 Configuración de CORS
app.enableCors({
  origin: (origin, callback) => {
    // Permite requests sin origin (Postman o servidor)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  credentials: true,
});

  // 🚀 Puerto dinámico en Railway (o 3000 en local)
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
}

bootstrap();
