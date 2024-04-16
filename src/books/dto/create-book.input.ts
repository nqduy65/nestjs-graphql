import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Author } from 'src/authors/entities/author.entity';

@InputType()
export class CreateBookInput {
  @IsString() // to validate type of value
  @Field() //SDL
  bookName: string;

  @Field(() => [Author], { nullable: true })
  authors?: Author[];
}
