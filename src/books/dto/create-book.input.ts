import { InputType, Field, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBookInput {
  @Field() //SDL
  @IsString({ message: 'bookName must be a string' }) // to validate type of
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  bookName: string;

  @Field() //SDL
  @IsString({ message: 'publishBy must be a string' }) // to validate type of value
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  publishBy: string;

  @Field(() => Int, {}) //SDL
  @IsNotEmpty()
  @IsInt({ message: 'publishYear must be an Integer' })
  publishYear: number;

  @IsString({ message: 'author must be a string' }) // to validate type of value
  @IsNotEmpty()
  @Field() //SDL
  author: string;
}
