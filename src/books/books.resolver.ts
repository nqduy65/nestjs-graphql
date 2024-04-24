import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.booksService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException(`Can not find the book with id ${id}`);
    }
    return book;
  }

  @Mutation(() => Book)
  async updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    if (!(await this.booksService.findOne(updateBookInput.id))) {
      throw new NotFoundException(
        `Can not find the book with id ${updateBookInput.id}`,
      );
    }
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  async removeBook(@Args('id', { type: () => Int }) id: number) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Can not find the book with id ${id}`);
    }
    return this.booksService.remove(book);
  }
}
