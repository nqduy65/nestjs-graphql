import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksResolver } from '../books.resolver';
import { BooksService } from '../books.service';
import { Book } from '../entities/book.entity';

describe('BooksResolver', () => {
  let resolver: BooksResolver;
  let service: BooksService;
  let bookRepository: Repository<Book>;

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

    service = module.get<BooksService>(BooksService);
    resolver = module.get<BooksResolver>(BooksResolver);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const bookData = {
        bookName: 'New Book',
        publishBy: 'Publish B',
        publishYear: 2023,
        author: 'John Doe',
      };
      const savedBook = { id: 1, ...bookData } as Book;

      jest.spyOn(service, 'create').mockResolvedValueOnce(savedBook);

      const result = await resolver.createBook(savedBook);

      expect(result).toEqual(savedBook);
      expect(service.create).toHaveBeenCalledWith(savedBook);
    });
  });

  describe('findAllBooks', () => {
    it('should return an array of books', async () => {
      const books = [
        {
          id: 1,
          bookName: 'Book A',
          publishBy: 'Publisher A',
          publishYear: 1998,
          author: 'Author A',
        },
        {
          id: 2,
          bookName: 'Book B',
          publishBy: 'Publisher B',
          publishYear: 1999,
          author: 'Author B',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(books);

      const result = await resolver.findAllBooks();
      expect(result).toEqual(books);
    });
  });
});
