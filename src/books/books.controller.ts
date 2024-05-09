import { Controller } from '@nestjs/common';

import {
  FindBookByIdDto,
  Book,
  BookServiceController,
  BookServiceControllerMethods,
} from '@/src/proto/book';

@Controller('book')
@BookServiceControllerMethods()
export class BookController implements BookServiceController {
  findOne(): Book {
    return {
      id: 1,
      bookName: 'abcd',
      publishBy: 'duy',
      publishYear: '100',
      author: 'test',
    };
  }
}
