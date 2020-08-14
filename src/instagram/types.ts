import { ApiProperty } from '@nestjs/swagger';
import { UserStoryFeedResponseRootObject } from 'instagram-private-api/dist/responses/user-story.feed.response';
import { MediaInfoResponseRootObject, UserRepositoryInfoResponseUser } from 'instagram-private-api/dist/responses';


export interface PostData {
  data: MediaInfoResponseRootObject,
  title: string
}


export class Stories {
  @ApiProperty()
  link_to_content: string;

  @ApiProperty()
  mentions: Array<string | null>;

  @ApiProperty()
  media_type: number;

  @ApiProperty()
  pk: number;

  @ApiProperty()
  id: string;
}

export class Profile {
  @ApiProperty()
  username: string;

  @ApiProperty()
  full_name?: string;

  @ApiProperty()
  profile_pic_url: string;

  @ApiProperty()
  media_count: number;

  @ApiProperty()
  follower_count: number;

  @ApiProperty()
  following_count: number;

  @ApiProperty()
  biography?: string;

  @ApiProperty()
  external_url?: string;

  @ApiProperty()
  is_private: boolean;
}


export class Content {
  @ApiProperty()
  content_url: string;

  @ApiProperty()
  media_type: number;
}

export class Post {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  contents: Array<Content>;

  @ApiProperty()
  user_tags: Array<string | null>;
}

export class ErrorResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class Signature {
  @ApiProperty()
  signature: string;

  @ApiProperty()
  verifyFp: string;

  @ApiProperty()
  userAgent: string;
}