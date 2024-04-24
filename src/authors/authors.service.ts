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
    const author = this.authorRepository.create(createAuthorInput);
    if (createAuthorInput.bookIds) {
      author.books = await Promise.all(
        createAuthorInput.bookIds.map((id) =>
          this.bookRepository.findOneBy({ id }),
        ),
      );
      const booksExist = author.books.every((el) => el !== null);
      if (!booksExist) {
        throw new NotFoundException(`Books do not exist.`);
      }
    }
    const res = await this.authorRepository.save(author);
    return res;
  }

  findAll() {
    return this.authorRepository.find({
      relations: {
        books: true,
      },
    });
  }

  findOne(id: number) {
    return this.authorRepository.findOne({
      where: { id },
      relations: { books: true },
    });
  }

  async update(id: number, updateAuthorInput: UpdateAuthorInput) {
    const author = await this.findOne(id);
    if (!author) {
      throw new NotFoundException();
    }
    if (updateAuthorInput.bookIds) {
      author.books = await Promise.all(
        updateAuthorInput.bookIds.map((id) =>
          this.bookRepository.findOneBy({ id }),
        ),
      );
      const booksExist = author.books.every((el) => el !== null);
      if (!booksExist) {
        throw new NotFoundException(`Books do not exist.`);
      }
    }
    Object.assign(author, updateAuthorInput);
    return await this.authorRepository.save(author);
  }

  async remove(author: Author) {
    const resAuthor = { ...author };
    await this.authorRepository.remove(author);
    return resAuthor;
  }
}
