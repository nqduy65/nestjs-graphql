import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { BookController } from './books.controller';
import { BookService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])], // to define the repository in this scope
  providers: [BookService],
  controllers: [BookController],
})
export class BooksModule {}
