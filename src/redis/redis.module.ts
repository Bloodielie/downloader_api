import { Global, Module } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import config from '../config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: RedisClient,
      useFactory: (): RedisClient => {
        return createClient({url: config.redis_url})
      }
    },
    RedisService
  ],
  exports: [
    RedisService
  ]
})
export class RedisModule {}
