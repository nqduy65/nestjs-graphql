import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Mutation(() => Author)
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ) {
    return this.authorsService.create(createAuthorInput);
  }

  @Query(() => [Author], { name: 'authors' })
  findAll() {
    return this.authorsService.findAll();
  }

  @Query(() => Author, { name: 'author' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const author = await this.authorsService.findOne(id);
    if (!author) {
      throw new NotFoundException(`Can not find the author with id ${id}`);
    }
    return author;
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput,
  ) {
    if (!(await this.authorsService.findOne(updateAuthorInput.id))) {
      throw new NotFoundException(
        `Can not find the author with id ${updateAuthorInput.id}`,
      );
    }
    return this.authorsService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Mutation(() => Author)
  async removeAuthor(@Args('id', { type: () => Int }) id: number) {
    const author = await this.findOne(id);
    if (!author) {
      throw new NotFoundException(`Can not find the author with id ${id}`);
    }
    return this.authorsService.remove(author);
  }
}
