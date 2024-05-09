import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookController } from './books.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // to define the repository in this scope
  providers: [BooksResolver, BooksService],
  controllers: [BookController],
})
export class BooksModule {}
