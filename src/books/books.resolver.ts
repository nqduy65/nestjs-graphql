import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { SearchBookDto } from './dto/search-book.dto';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'findAllBooks' })
  async findAllBooks(
    @Args('query', { nullable: true }) searchBookDto?: SearchBookDto,
  ) {
    const books = await this.booksService.findAll(searchBookDto);
    return books;
  }

  @Query(() => [Book], { name: 'findBookByName' })
  async findOneBookByName(
    @Args('bookName', { type: () => String }) bookName: string,
  ) {
    const book = await this.booksService.findOneByBookName(bookName);
    return book;
  }

  @Mutation(() => Book)
  async updateBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
  ) {
    return this.booksService.update(id, updateBookInput);
  }

  @Mutation(() => Book)
  async removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.remove(id);
  }
}
