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
    //using forRootAsync to async function in factory and using dependency injecttion <inject: [ConfigService]>
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver, // default driver for GraphQL module
      imports: [ConfigModule], //import ConfigModle to get variables in .env
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: configService.get<string>('GRAPHQL_SCHEMA_FILE'), //auto generate .gql file from Decorators in models ObjectType and Resolver
        // typePaths: configService.get<string[]>('GRAPHQL_TYPE_PATHS'), //when we need to apply schema first
      }),
      inject: [ConfigService],
    }),
    BooksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
