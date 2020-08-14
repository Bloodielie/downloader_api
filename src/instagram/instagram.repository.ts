import { IgApiClient, UserRepositoryInfoResponseUser, UserStoryFeedResponseRootObject } from 'instagram-private-api';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PostData } from './types';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class InstagramRepository {
  constructor(
    private readonly ig: IgApiClient,
    private readonly redis: RedisService
  ) {}

  public async getUserStoriesByUserName(userName: string): Promise<UserStoryFeedResponseRootObject | null> {
    const redisStoriesKey = `instagram:stories:${userName}`;
    const stories = await this.redis.get(redisStoriesKey);
    if (stories) {
      return JSON.parse(stories)
    }
    try {
      const usernameId = await this.ig.user.getIdByUsername(userName);
      const result = await this.ig.feed.userStory(usernameId).request();
      await this.redis.setex(redisStoriesKey, 600, JSON.stringify(result));
      return result
    } catch (e) {
      await this.redis.setex(redisStoriesKey, 600, JSON.stringify(null));
      return null
    }
  }

  public async getUserInfoByUserName(userName: string): Promise<UserRepositoryInfoResponseUser | null> {
    const redisProfileKey = `instagram:profile:${userName}`;
    const profile = await this.redis.get(redisProfileKey);
    if (profile) {
      return JSON.parse(profile)
    }
    try {
      const usernameId = await this.ig.user.getIdByUsername(userName);
      const result = await this.ig.user.info(usernameId);
      await this.redis.setex(redisProfileKey, 3600, JSON.stringify(result));
      return result
    } catch (e) {
      await this.redis.setex(redisProfileKey, 3600, JSON.stringify(null));
      return null
    }
  }

  public async getPostByAddress(address: string): Promise<PostData | null> {
    const redisPostKey = `instagram:post:${address}`;
    const post = await this.redis.get(redisPostKey);
    if (post) {
      return JSON.parse(post)
    }

    try {
      const serverResponse = await axios.get(
        `https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${address}/`
      );
      const data = await this.ig.media.info(serverResponse.data.media_id);
      const result = { data: data, title: serverResponse.data.title };
      await this.redis.setex(redisPostKey, 86400, JSON.stringify(result));
      return result;
    } catch (e) {
      await this.redis.setex(redisPostKey, 86400, JSON.stringify(null));
      return null
    }
  }
}