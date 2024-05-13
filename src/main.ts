import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BOOK_PACKAGE_NAME } from './proto/book';
import { join } from 'path/posix';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: BOOK_PACKAGE_NAME,
        protoPath: join(__dirname, '../src/proto/book.proto'),
        url: 'localhost:4000',
      },
    },
  );

  await app.listen();
}
bootstrap();
