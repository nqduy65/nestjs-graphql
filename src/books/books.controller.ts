import { Controller } from '@nestjs/common';

import {
  FindBookByIdDto,
  BookServiceController,
  BookServiceControllerMethods,
  CreateBookDto,
  FindBookDto,
  UpdateBookDto,
} from '@/src/proto/book';
import { GrpcMethod } from '@nestjs/microservices';
import { BookService } from './books.service';

@Controller('book')
@BookServiceControllerMethods()
export class BookController implements BookServiceController {
  constructor(private readonly bookService: BookService) {}

  @GrpcMethod('BookService', 'Create')
  create(createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @GrpcMethod('BookService', 'FindOneById')
  findOneById(data: FindBookByIdDto) {
    return this.bookService.findOneById(data.id);
  }

  @GrpcMethod('BookService', 'FindAll')
  findAll(searchBookDto?: FindBookDto) {
    return this.bookService.findAll(searchBookDto);
    // return this.bookService.findAll();
  }

  @GrpcMethod('BookService', 'Update')
  update(updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto.id, updateBookDto);
  }

  @GrpcMethod('BookService', 'Remove')
  remove(data: FindBookByIdDto) {
    return this.bookService.remove(data.id);
  }
}
