import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { ErrorResponse, Post, Profile, Stories } from './types';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('instagram')
@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagram: InstagramService,) {}

  @Get("/stories")
  @ApiResponse({ status: 200, description: 'Gives back to history', type: Stories })
  @ApiResponse({ status: 400, description: 'user_name must be passed', type: ErrorResponse })
  async getStories(@Query('user_name') userName: string): Promise<any> {
    if (!userName) throw new HttpException('user_name must be passed', 400);

    const stories = await this.instagram.getStories(userName);
    if (!stories) throw new HttpException('user_name not valid', 400);
    return stories
  }

  @Get("/profile")
  @ApiResponse({ status: 200, description: 'Gives back to profile data', type: Profile })
  @ApiResponse({ status: 400, description: 'user_name must be passed', type: ErrorResponse })
  async getProfile(@Query('user_name') userName: string): Promise<any> {
    if (!userName) throw new HttpException('user_name must be passed', 400);
    const profile = await this.instagram.getProfile(userName);
    if (!profile) throw new HttpException('user_name not valid', 400);
    return profile
  }

  @Get("/post")
  @ApiResponse({ status: 200, description: 'Gives back to post data', type: Post })
  @ApiResponse({ status: 400, description: 'post_address must be passed', type: ErrorResponse })
  async getPost(@Query('post_address') postAddress: string): Promise<any> {
    if (!postAddress) throw new HttpException('post_address must be passed', 400);

    const post = await this.instagram.getPost(postAddress);
    if (!post) throw new HttpException('post_address not valid', 400);
    return post
  }
}