import { Module } from '@nestjs/common';
import { TikTokController } from './tiktok.controller';
import Signer from 'tiktok-signature';
import { TikTokService } from './tiktok.service';


@Module({
  controllers: [TikTokController],
  providers: [
    {
      provide: Signer,
      useFactory: async (): Promise<Signer> => {
        const signer = new Signer();
        return await signer.init();
      },
    },
    TikTokService,
  ],
})
export class TikTokModule {}
