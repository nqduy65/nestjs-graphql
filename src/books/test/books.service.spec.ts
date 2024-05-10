import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from '../books.service';
import { Book } from '../entities/book.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(bookRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const bookData = {
        bookName: 'New Book',
        publishBy: 'Publish B',
        publishYear: 2023,
        author: 'John Doe',
      };
      const savedBook = { id: 1, ...bookData } as Book;
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(savedBook);
      const result = await service.create(bookData);
      expect(result).toEqual(savedBook);
      expect(bookRepository.save).toHaveBeenCalledWith(bookData);
    });

    it('should throw ConflictException on error', async () => {
      const bookData = {
        bookName: 'New Book',
        publishBy: 'Publish B',
        publishYear: 2023,
        author: 'John Doe',
      };
      const savedBook = { id: 1, ...bookData } as Book;
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(savedBook);
      jest
        .spyOn(bookRepository, 'save')
        .mockRejectedValueOnce(
          new Error(`Book with name ${bookData.bookName} does exist`),
        );

      await expect(service.create(bookData)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
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
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(books);
      const result = await service.findAll();
      expect(result).toEqual(books);
    });

    it('should throw Bad Request with no books found', async () => {
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce([]);
      await expect(service.findAll()).rejects.toThrowError(BadRequestException);
    });
  });
});
