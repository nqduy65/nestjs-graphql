import { Test, TestingModule } from '@nestjs/testing';
import { BooksResolver } from '@/src/books/books.resolver';
import { BooksService } from '@/src/books/books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '@/src/books/entities/book.entity';
import { Repository } from 'typeorm';

describe('BooksResolver', () => {
  let resolver: BooksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksResolver,
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<BooksResolver>(BooksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
