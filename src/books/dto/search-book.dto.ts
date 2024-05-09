import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

@InputType()
export class SearchBookDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  bookName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  publishBy?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  publishYear?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  author?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  limit?: number;
}
