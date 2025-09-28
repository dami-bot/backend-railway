import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
 

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

 

  const allowedOrigins = [
    'http://localhost:3000',
     process.env.FRONTEND_URL || 'https://sistema-de-inventario-2q5p32y8w-dami-bots-projects.vercel.app'];
  // 🌍 Configuración de CORS

  console.log('✅ FRONTEND_URL actual:', process.env.FRONTEND_URL);
  console.log('✅ Allowed origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
       console.log('🔎 Origin recibido:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`❌ CORS no permitido desde: ${origin}`);
        callback(new Error('CORS no permitido'));
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 🚀 Puerto dinámico en Railway (o 3000 en local)
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
}

bootstrap();
