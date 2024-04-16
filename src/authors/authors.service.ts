import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createAuthorInput: CreateAuthorInput) {
    if (createAuthorInput.books) {
      const existBookCheck = createAuthorInput.books.every(async (book) => {
        await this.bookRepository.findOneBy({ id: book.id });
      });
      if (!existBookCheck) {
        throw new NotFoundException();
      }
    }
    const author = this.authorRepository.create(createAuthorInput);
    return await this.authorRepository.save(author);
  }

  findAll() {
    return this.authorRepository.find();
  }

  findOne(id: number) {
    return this.authorRepository.findOneBy({ id });
  }

  async update(id: number, updateAuthorInput: UpdateAuthorInput) {
    const author = await this.findOne(id);
    if (!author) {
      throw new NotFoundException();
    }
    Object.assign(author, updateAuthorInput);
    return await this.authorRepository.save(author);
  }

  async remove(id: number) {
    const author = await this.findOne(id);
    if (!author) {
      throw new NotFoundException();
    }
    return await this.authorRepository.remove(author);
  }
}
