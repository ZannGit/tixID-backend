import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Jalankan server dulu
  await app.listen(3000);

  // Setelah server jalan, baru bisa get URL
  const appUrl = await app.getUrl();
  console.log(`🚀 Server is running on: ${appUrl}`);
}
bootstrap();
