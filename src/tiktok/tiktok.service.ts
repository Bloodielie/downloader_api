import { Injectable } from '@nestjs/common';
import { Signature } from '../instagram/types';
import Signer = require('tiktok-signature');

@Injectable()
export class TikTokService {
  constructor(private signer: Signer) {}

  async getSignature(url: string): Promise<Signature> {
    const verifyFp = await this.signer.getVerifyFp();
    const signature = await this.signer.sign(String(url));
    return {
      signature: signature,
      verifyFp: verifyFp,
      userAgent: this.signer.userAgent
    };
  }
}
