import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ErrorResponse, Signature } from '../instagram/types';
import { TikTokService } from './tiktok.service';

@ApiTags('tiktok')
@Controller('tiktok')
export class TikTokController {
  constructor(private readonly tiktok: TikTokService) {}

  @Get("/signature")
  @ApiResponse({ status: 200, description: 'Gives back to signature', type: Signature })
  @ApiResponse({ status: 400, description: 'url must be passed', type: ErrorResponse })
  async getSignature(@Query('url') url: string): Promise<any> {
    if (!url) throw new HttpException('url must be passed', 400);

    return this.tiktok.getSignature(url)
  }
}
