import { Module } from '@nestjs/common';
import { InstagramModule } from './instagram/instagram.module';
import { RedisModule } from './redis/redis.module';
import { TikTokModule } from './tiktok/tiktok.modules';

@Module({
  imports: [InstagramModule, RedisModule, TikTokModule],
})
export class AppModule {}
