import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('authors')
@ObjectType('Author')
@InputType('AuthorInput')
export class Author {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'character varying' })
  @Field()
  authorName: string;

  @Column({ type: 'int4' })
  @Field(() => Int)
  bornYear: number;

  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable()
  @Field(() => [Book], { nullable: true })
  books: Book[];
}
