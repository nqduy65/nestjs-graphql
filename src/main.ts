import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BOOK_PACKAGE_NAME } from './proto/book';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: BOOK_PACKAGE_NAME,
        protoPath: join(__dirname, '../proto/book.proto'),
        url: 'localhost:4000',
      },
    },
  );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //   }),
  // );
  await app.listen();
}
bootstrap();
