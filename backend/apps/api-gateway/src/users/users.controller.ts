import { GetUser } from '@app/common/decorators/get-user.decorator';
import { Public } from '@app/common/decorators/public.decorator';
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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from 'apps/users-service/src/dtos/update-user.dto';
import { Role } from 'apps/users-service/src/enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all users (Admin only)',
    description: 'Retrieve list of all users - requires admin role',
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve user profile information',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('find-many')
  @Public()
  @ApiOperation({
    summary: 'Get users by IDs',
    description: 'Retrieve user profiles by IDs',
  })
  @ApiBody({ type: [Number] })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findMany(@Body() userIds: number[]) {
    return this.usersService.findMany(userIds);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update user information (self only)',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user account',
    description: 'Delete a user account (self only)',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Get(':userId/posts')
  @ApiOperation({
    summary: 'Get user posts',
    description: 'Retrieve all posts created by a specific user',
  })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User posts retrieved successfully',
  })
  findUserPosts(@Param('userId') userId: number) {
    return this.usersService.findUserPosts(userId);
  }

  @Get(':userId/liked-posts')
  @ApiOperation({
    summary: 'Get user liked posts',
    description: 'Retrieve all posts liked by a specific user',
  })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User liked posts retrieved successfully',
  })
  findUserLikedPosts(@Param('userId') userId: number) {
    return this.usersService.findUserLikedPosts(userId);
  }

  @Get(':userId/bookmarks')
  @ApiOperation({
    summary: 'Get user bookmarks',
    description: 'Retrieve all bookmarks created by a specific user',
  })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User bookmarks retrieved successfully',
  })
  findUserBookmarks(@Param('userId') userId: number) {
    return this.usersService.findUserBookmarks(userId);
  }

  @Post(':followedId/follow')
  @ApiOperation({
    summary: 'Follow a user',
    description: 'Follow another user',
  })
  @ApiParam({
    name: 'followedId',
    type: Number,
    description: 'User ID to follow',
  })
  @ApiResponse({ status: 201, description: 'User followed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  followUser(
    @GetUser('sub') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    return this.usersService.followUser(followerId, followedId);
  }

  @Delete(':followedId/follow')
  @ApiOperation({
    summary: 'Unfollow a user',
    description: 'Unfollow another user',
  })
  @ApiParam({
    name: 'followedId',
    type: Number,
    description: 'User ID to unfollow',
  })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  unfollowUser(
    @GetUser('sub') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    return this.usersService.unfollowUser(followerId, followedId);
  }
}
