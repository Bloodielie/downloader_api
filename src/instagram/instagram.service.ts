import { Injectable } from '@nestjs/common';
import { Post, Profile, Stories } from './types';
import { InstagramRepository } from './instagram.repository';

@Injectable()
export class InstagramService {
  constructor(private readonly instagramRepository: InstagramRepository) {}

  public async getStories(userName: string): Promise<Array<Stories | null> | null> {
    const result = [];

    const stories = await this.instagramRepository.getUserStoriesByUserName(userName);
    if (!stories) return null;

    if (stories.reel == null) return [];

    for (const storiesItem of stories.reel.items) {
      result.push({
        link_to_content: this._getContentUrl(storiesItem),
        mentions: this._getStoryMentions(storiesItem),
        media_type: storiesItem.media_type,
        pk: storiesItem.pk,
        id: storiesItem.id
      });
    }
    return result
  }

  public async getProfile(userName: string): Promise<Profile | null> {
    const user = await this.instagramRepository.getUserInfoByUserName(userName);
    if (!user) return null;

    return {
      username: user.username,
      full_name: user.full_name,
      profile_pic_url: user.hd_profile_pic_url_info.url,
      media_count: user.media_count,
      follower_count: user.follower_count,
      following_count: user.following_count,
      biography: user.biography,
      external_url: user.external_url,
      is_private: user.is_private
    }
  }

  public async getPost(post_address: string): Promise<Post | null> {
    const post: any = await this.instagramRepository.getPostByAddress(post_address);
    if (!post) return null;

    const content_urls = [];
    const userTags = [];
    const postItem = post.data.items[0];

    if (postItem.carousel_media) {
      for (const media of postItem.carousel_media) {
        content_urls.push({
          content_url: this._getContentUrl(media),
          media_type: media.media_type
        })
      }
    } else {
      content_urls.push({
        content_url: this._getContentUrl(postItem),
        media_type: postItem.media_type
      })
    }

    if (postItem.usertags) {
      for (const user of postItem.usertags.in) {
        userTags.push(`https://www.instagram.com/${user.user.username}/`);
      }
    }

    return {
      title: post.title,
      contents: content_urls,
      user_tags: userTags
    }
  }

  private _getContentUrl(postItem: any): string {
    if (postItem.video_versions) {
      return postItem.video_versions[0].url
    } else {
      return postItem.image_versions2.candidates[0].url
    }
  }

  private _getStoryMentions(story: any): Array<string> {
    const storyMentions: string[] = [];

    if (story.story_cta) {
      for (const cta of story.story_cta) {
        for (const link of cta.links) {
          storyMentions.push(link.webUri);
        }
      }
    }
    if (story.reel_mentions) {
      for (const mention of story.reel_mentions) {
        storyMentions.push(`https://www.instagram.com/${mention.user.username}/`);
      }
    }

    return storyMentions;
  }
}
