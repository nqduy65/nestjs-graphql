import { Controller } from '@nestjs/common';

import {
  FindBookByIdDto,
  Book,
  BookServiceController,
  BookServiceControllerMethods,
  CreateBookDto,
  FindBookDto,
} from '@/src/proto/book';
import { GrpcMethod } from '@nestjs/microservices';
import { BookService } from './books.service';

@Controller('book')
@BookServiceControllerMethods()
export class BookController implements BookServiceController {
  constructor(private readonly bookService: BookService) {}

  @GrpcMethod('BookService', 'CreateBook')
  create(createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @GrpcMethod('BookService', 'FindOne')
  findOneById(data: FindBookByIdDto): Book {
    return {
      id: 2,
      bookName: 'abcd',
      publishBy: 'duy',
      publishYear: 1998,
      author: 'test',
    };
  }

  @GrpcMethod('BookService', 'FindAll')
  findAll(searchBookDto?: FindBookDto): Book {
    return {
      id: 3,
      bookName: 'abcd',
      publishBy: 'duy',
      publishYear: 1998,
      author: 'test',
    };
  }
}
