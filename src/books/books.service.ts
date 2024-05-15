import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { ILike, Repository } from 'typeorm';
import { Book, CreateBookDto, FindBookDto, UpdateBookDto } from '../proto/book';
import { BookEntity } from './entities/book.entity';
import { BookListResponse } from './dto/book-list-repsonse.dto';
import {
  GrpcAlreadyExistsException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
} from 'nestjs-grpc-exceptions';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto) {
    const bookName = createBookDto.bookName;
    const existedBook = await this.bookRepository.findOneBy({ bookName });
    if (existedBook) {
      throw new GrpcAlreadyExistsException(
        `Book with name \'${bookName}\' already exists`,
      );
    }
    try {
      const res = await this.bookRepository.save(createBookDto);
      return res;
    } catch (error) {
      throw new GrpcInvalidArgumentException(
        'Can not create a new book due to Invalid arguments',
      );
    }
  }

  async findAll(searchBookDto?: FindBookDto) {
    if (!searchBookDto) {
      const books = await this.bookRepository.find();
      if (books.length === 0) {
        throw new GrpcNotFoundException(`No books found.`);
      }
      return { bookList: books } as BookListResponse;
    }
    const bookName = searchBookDto.bookName ?? '';
    const publishBy = searchBookDto.publishBy ?? '';
    const publishYear = searchBookDto.publishYear ?? null;
    const author = searchBookDto.author ?? '';
    const limit = searchBookDto.limit ?? null;

    const books = await this.bookRepository.find({
      where: {
        bookName: ILike(`%${bookName}%`),
        publishBy: ILike(`%${publishBy}%`),
        publishYear: publishYear,
        author: ILike(`%${author}%`),
      },
      take: limit,
    });
    if (books.length === 0) {
      throw new GrpcNotFoundException(`No books found.`);
    }
    return { bookList: books } as BookListResponse;
  }

  // async findOneByBookName(bookName: string) {
  //   if (bookName) {
  //     const book = await this.bookRepository.findOne({
  //       where: { bookName: bookName },
  //     });
  //     if (!book) {
  //       throw new NotFoundException(
  //         `Book with name \'${bookName}\' does not exist`,
  //       );
  //     }
  //     return book;
  //   }
  //   const books = await this.findAll();
  //   return books;
  // }

  async findOneById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
    });
    if (!book) {
      throw new GrpcNotFoundException(`Book with id ${id} does not exist`);
    }
    return book;
  }

  async update(id: number, updateBookInput: UpdateBookDto) {
    const book = await this.findOneById(id);
    if (!book) {
      throw new GrpcNotFoundException(`Book with id ${id} does not exist`);
    }
    try {
      await this.bookRepository.update(id, updateBookInput);
      const book = await this.bookRepository.findOneBy({ id });
      return book;
    } catch (error) {
      throw new GrpcInvalidArgumentException(
        `Can not update the book with id ${id} due to invalid arguments`,
      );
    }
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new GrpcNotFoundException(`Book with id ${id} does not exist`);
    }
    try {
      await this.bookRepository.delete(id);
      return book;
    } catch (error) {
      throw new GrpcInvalidArgumentException(
        `Can not remove the book with id ${id} due to invalid arguments`,
      );
    }
  }
}
