import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBookInput {
  @IsString() // to validate type of value
  @Field() //SDL
  bookName: string;

  @Field(() => [Int], { nullable: true })
  authorIds?: number[];
}
