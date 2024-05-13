import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'books' })
@ObjectType('Book')
export class BookEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'text', name: 'book_name' })
  @Field()
  bookName: string;

  @Column({ type: 'text', name: 'publish_by' })
  @Field()
  publishBy: string;

  @Column({ type: 'text', name: 'publish_year' })
  @Field(() => Int)
  publishYear: number;

  @Column({ type: 'text', name: 'author' })
  @Field()
  author: string;
}
