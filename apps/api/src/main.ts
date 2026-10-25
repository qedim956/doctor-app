import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DomainErrorFilter } from './common/domain-error.filter.js';

try {
  process.loadEnvFile('../../.env');
} catch {
  // prod-da .env faylı olmur, dəyişənlər serverdən gəlir
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DomainErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();