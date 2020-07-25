import {IgApiClient} from 'instagram-private-api';
import * as process from "process";
import axios from 'axios'
import {PostResponse, ProfileResponse, StoriesResponse} from "./types";


export async function login(ig: IgApiClient, userName: string, password: string): Promise<void> {
    ig.state.generateDevice(userName);
    await ig.simulate.preLoginFlow();
    await ig.account.login(userName, password);
    process.nextTick(async () => await ig.simulate.postLoginFlow());
}


function getContentUrl(postItem: any): string {
    if (postItem.video_versions) {
        return postItem.video_versions[0].url
    } else {
        return postItem.image_versions2.candidates[0].url
    }
}


export function getStoryMentions(story: any): Array<string> {
    let storyMentions: string[] = [];

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


export async function getStories(ig: IgApiClient, userName: string): Promise<Array<StoriesResponse | null>> {
    let result = Array();
    const usernameId = await ig.user.getIdByUsername(userName);
    const stories = await ig.feed.userStory(usernameId).request();
    if (stories.reel == null) return [];
    for (let storiesItem of stories.reel.items) {
        result.push({
            link_to_content: getContentUrl(storiesItem),
            mentions: getStoryMentions(storiesItem),
            media_type: storiesItem.media_type,
            pk: storiesItem.pk,
            id: storiesItem.id
        });
    }
    return result
}


export async function getProfileInfo(ig: IgApiClient, userName: string): Promise<ProfileResponse> {
    const usernameId = await ig.user.getIdByUsername(userName);
    const user = await ig.user.info(usernameId);
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


export async function getPostInfo(ig: IgApiClient, photo_cache: string): Promise<PostResponse> {
    const serverResponse = await axios.get(`https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${photo_cache}/`);
    const post: any = await ig.media.info(serverResponse.data.media_id);
    const content_urls = Array();
    const userTags = Array();
    const postItem = post.items[0];

    if (postItem.carousel_media) {
        for (const media of postItem.carousel_media) {
            content_urls.push({
                content_url: getContentUrl(media),
                media_type: media.media_type
            })
        }
    } else {
        content_urls.push({
            content_url: getContentUrl(postItem),
            media_type: postItem.media_type
        })
    }

    if (postItem.usertags) {
        for (const user of postItem.usertags.in) {
            userTags.push(`https://www.instagram.com/${user.user.username}/`);
        }
    }

    return {
        title: serverResponse.data.title,
        contents: content_urls,
        user_tags: userTags
    }
}
