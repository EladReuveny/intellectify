import { GetUser } from '@app/common/decorators/get-user.decorator';
import { Roles } from '@app/common/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateUserDto } from 'apps/users-service/src/dtos/update-user.dto';
import { Role } from 'apps/users-service/src/enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Get(':userId/posts')
  findUserPosts(@Param('userId') userId: number) {
    return this.usersService.findUserPosts(userId);
  }

  @Get(':userId/liked-posts')
  findUserLikedPosts(@Param('userId') userId: number) {
    return this.usersService.findUserLikedPosts(userId);
  }

  @Get(':userId/bookmarks')
  findUserBookmarks(@Param('userId') userId: number) {
    return this.usersService.findUserBookmarks(userId);
  }

  @Post(':followedId/follow')
  followUser(
    @GetUser('sub') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    return this.usersService.followUser(followerId, followedId);
  }

  @Delete(':followedId/follow')
  unfollowUser(
    @GetUser('sub') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    return this.usersService.unfollowUser(followerId, followedId);
  }
}
