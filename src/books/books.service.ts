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
        throw new NotFoundException();
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

  findOne(id: number) {
    return this.bookRepository.findOne({
      where: { id },
      relations: { authors: true },
    });
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException();
    }
    Object.assign(book, updateBookInput);
    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException();
    }
    return await this.bookRepository.remove(book);
  }
}
