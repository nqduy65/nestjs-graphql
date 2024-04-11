import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>, // to inject an instance of repository of Book to the BookService
  ) {}
  async create(createBookInput: CreateBookInput) {
    const book = this.bookRepository.create(createBookInput);
    return await this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find();
  }

  async findOne(id: number) {
    return await this.bookRepository.findOneBy({ id });
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
