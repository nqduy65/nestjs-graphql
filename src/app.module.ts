import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //forRootAsync to synchronize the connect
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true,
      }),
    }),

    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     autoSchemaFile: configService.get<string>('GRAPHQL_SCHEMA_FILE'),
    //     formatError(error) {
    //       const originalError = error.extensions?.originalError;
    //       if (originalError)
    //         return {
    //           message: originalError['message'],
    //           code: originalError['error'],
    //           status: originalError['statusCode'],
    //         };
    //       return {
    //         message: error.message,
    //         code: error.extensions?.status || 400,
    //         status:
    //           error.extensions?.code !== 'GRAPHQL_VALIDATION_FAILED'
    //             ? error.extensions?.code !== 'INTERNAL_SERVER_ERROR'
    //               ? error.extensions?.code
    //               : 'BAD_REQUEST'
    //             : 'BAD_REQUEST',
    //       };
    //     },
    //   }),
    // }),
    BooksModule,
  ],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
