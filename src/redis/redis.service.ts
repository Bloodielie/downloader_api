import { Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { promisify } from "util";


@Injectable()
export class RedisService {
  constructor(private readonly redis: RedisClient) {}

  public async get(key: string): Promise<string | null> {
    const async_get = promisify(this.redis.get).bind(this.redis);
    return await async_get(key);
  }

  public async setex(key: string, sec: number, value: string): Promise<null> {
    const async_setex = promisify(this.redis.setex).bind(this.redis);
    return await async_setex(key, sec, value);
  }
}