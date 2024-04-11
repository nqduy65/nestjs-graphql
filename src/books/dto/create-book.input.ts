import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBookInput {
  @IsString() // to validate type of value
  @Field() //SDL
  bookname: string;

  @IsString() // to validate type of value
  @Field() //SDL
  author: string;
}
