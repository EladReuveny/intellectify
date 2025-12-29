import { Microservice } from '@app/common/constants/microservices';
import { PostsPattern } from '@app/common/constants/patterns/posts.pattern';
import { USERS_PATTERNS } from '@app/common/constants/patterns/users.patterns';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from 'apps/users-service/src/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Microservice.USERS)
    private readonly usersClient: ClientProxy,
    @Inject(Microservice.POSTS) private readonly postsClient: ClientProxy,
  ) {}

  findAll() {
    return this.usersClient.send(USERS_PATTERNS.commands.FIND_ALL, {});
  }

  findOne(id: number) {
    return this.usersClient.send(USERS_PATTERNS.commands.FIND_ONE, { id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersClient.send(USERS_PATTERNS.commands.UPDATE, {
      id,
      updateUserDto,
    });
  }

  remove(id: number) {
    return this.usersClient.send(USERS_PATTERNS.commands.REMOVE, { id });
  }

  findUserPosts(userId: number) {
    return this.postsClient.send(PostsPattern.commands.FIND_USER_POSTS, {
      userId,
    });
  }

  findUserLikedPosts(userId: number) {
    return this.postsClient.send(PostsPattern.commands.FIND_USER_LIKED_POSTS, {
      userId,
    });
  }

  findUserBookmarks(userId: number) {
    return this.postsClient.send(
      PostsPattern.commands.FIND_USER_BOOKMARKED_POSTS,
      { userId },
    );
  }
}
