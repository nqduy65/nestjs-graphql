import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Author } from 'src/authors/entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>, // to inject an instance of repository of Book to the BookService
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createBookInput: CreateBookInput) {
    const book = this.bookRepository.create(createBookInput);
    if (createBookInput.authorIds) {
      book.authors = await Promise.all(
        createBookInput.authorIds.map((id) =>
          this.authorRepository.findOneBy({ id }),
        ),
      );
      const booksExist = book.authors.every((el) => el !== null);
      if (!booksExist) {
        throw new NotFoundException(`Authors do not exist.`);
      }
    }
    const res = await this.bookRepository.save(book);
    return res;
  }

  findAll() {
    return this.bookRepository.find({
      relations: {
        authors: true,
      },
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: { authors: true },
    });
    return book;
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    const book = await this.findOne(id);
    if (updateBookInput.authorIds) {
      book.authors = await Promise.all(
        updateBookInput.authorIds.map((id) =>
          this.authorRepository.findOneBy({ id }),
        ),
      );
      const booksExist = book.authors.every((el) => el !== null);
      if (!booksExist) {
        throw new NotFoundException(`Authors do not exist`);
      }
    }
    Object.assign(book, updateBookInput);
    return await this.bookRepository.save(book);
  }

  async remove(book: Book) {
    const resBook = { ...book };
    await this.bookRepository.remove(book);
    return resBook;
  }
}
