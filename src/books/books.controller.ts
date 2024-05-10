import { Controller } from '@nestjs/common';

import {
  FindBookByIdDto,
  Book,
  BookServiceController,
  BookServiceControllerMethods,
} from '@/src/proto/book';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('book')
@BookServiceControllerMethods()
export class BookController implements BookServiceController {
  @GrpcMethod('BookService', 'FindOne')
  findOne(data: FindBookByIdDto): Book {
    return {
      id: 1,
      bookName: 'abcd',
      publishBy: 'duy',
      publishYear: '100',
      author: 'test',
    };
  }
}
