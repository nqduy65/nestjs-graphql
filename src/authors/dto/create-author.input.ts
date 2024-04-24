import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateAuthorInput {
  @IsString()
  @Field()
  authorName: string;

  @IsNumber()
  @Field(() => Int)
  bornYear: number;

  @Field(() => [Int], { nullable: true })
  bookIds?: number[];
}
