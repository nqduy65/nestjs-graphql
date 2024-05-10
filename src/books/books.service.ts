import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { SearchBookDto } from './dto/search-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>, // to inject an instance of repository of Book to the BookService
  ) {}
  async create(createBookInput: CreateBookInput) {
    const bookName = createBookInput.bookName;
    const existedBook = await this.bookRepository.findOneBy({ bookName });
    if (existedBook) {
      throw new ConflictException(
        `Book with name \'${bookName}\' already exists`,
      );
    }
    try {
      const res = await this.bookRepository.save(createBookInput);
      return res;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(searchBookDto?: SearchBookDto) {
    if (!searchBookDto) {
      const books = await this.bookRepository.find();
      if (books.length === 0) {
        throw new BadRequestException('No books founded');
      }
      return books;
    }
    const bookName = searchBookDto.bookName ?? '';
    const publishBy = searchBookDto.publishBy ?? '';
    const publishYear = searchBookDto.publishYear ?? null;
    const author = searchBookDto.author ?? '';
    const limit = searchBookDto.limit ?? null;

    try {
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
        throw new NotFoundException('No books found.');
      }
      return books;
    } catch (error) {
      throw error;
    }
  }

  async findOneByBookName(bookName: string) {
    if (bookName) {
      const book = await this.bookRepository.findOne({
        where: { bookName: bookName },
      });
      if (!book) {
        throw new NotFoundException(
          `Book with name \'${bookName}\' does not exist`,
        );
      }
      return book;
    }
    const books = await this.findAll();
    return books;
  }

  async findOneById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} does not exist`);
    }
    return book;
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    const book = await this.findOneById(id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} does not exist`);
    }
    try {
      await this.bookRepository.update(id, updateBookInput);
      return this.bookRepository.findOneBy({ id });
    } catch (error) {
      throw new BadRequestException(
        `Can not update the book with id ${id}`,
        error,
      );
    }
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} does not exist`);
    }
    try {
      await this.bookRepository.delete(id);
      return book;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
