import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Book } from 'src/books/entities/book.entity';

@InputType()
export class CreateAuthorInput {
  @IsString()
  @Field()
  authorName: string;

  @IsNumber()
  @Field(() => Int)
  bornYear: number;

  @Field(() => [Book], { nullable: true })
  @IsOptional()
  books?: Book[];
}
