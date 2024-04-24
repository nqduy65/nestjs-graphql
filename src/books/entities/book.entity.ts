import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Author } from 'src/authors/entities/author.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'books' })
@ObjectType('Book')
@InputType('BookInput')
export class Book {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'text', name: 'book_name' })
  @Field()
  bookName: string;

  @ManyToMany(() => Author, (author) => author.books)
  @Field(() => [Author], { nullable: true })
  authors: Author[];
}
