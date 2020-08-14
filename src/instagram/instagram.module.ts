import { Module } from '@nestjs/common';
import {IgApiClient} from 'instagram-private-api';
import config from "../config";
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';
import { InstagramRepository } from './instagram.repository';

@Module({
  controllers: [InstagramController],
  providers: [
    {
      provide: IgApiClient,
      useFactory: async (): Promise<IgApiClient> => {
        const ig = new IgApiClient();
        ig.state.generateDevice(config.userName);
        await ig.simulate.preLoginFlow();
        await ig.account.login(config.userName, config.password);
        process.nextTick(async () => await ig.simulate.postLoginFlow());
        return ig
      },
    },
    InstagramRepository,
    InstagramService,
  ],
})
export class InstagramModule {}
