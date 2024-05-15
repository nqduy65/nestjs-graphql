import { ObjectType, Field } from '@nestjs/graphql';
import { Book } from '../../proto/book';
import { BookEntity } from '../entities/book.entity';

@ObjectType('BookResponse')
export class BookResponse {
  @Field(() => BookEntity)
  book: Book;
}
