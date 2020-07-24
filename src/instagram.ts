import {IgApiClient} from 'instagram-private-api';
import * as process from "process";
import axios from 'axios'
import {PostResponse, ProfileResponse} from "./types";


export async function login(ig: IgApiClient, userName: string, password: string): Promise<void> {
    ig.state.generateDevice(userName);
    await ig.simulate.preLoginFlow();
    await ig.account.login(userName, password);
    process.nextTick(async () => await ig.simulate.postLoginFlow());
}


export async function getStories(ig: IgApiClient, userName: string): Promise<Array<string>> {
    let result = Array();
    const usernameId = await ig.user.getIdByUsername(userName);
    const stories = await ig.feed.userStory(usernameId).request();
    if (stories.reel == null) return [];
    for (let storiesItem of stories.reel.items) {
        let video = storiesItem.video_versions;
        if (!video) {
            result.push(storiesItem.image_versions2.candidates[0].url);
            continue
        }
        result.push(video[0].url);
    }
    return result
}


export async function getProfileInfo(ig: IgApiClient, userName: string): Promise<ProfileResponse> {
    const usernameId = await ig.user.getIdByUsername(userName);
    const user = await ig.user.info(usernameId);
    return {
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
        media_count: user.media_count,
        follower_count: user.follower_count,
        following_count: user.following_count,
        biography: user.biography,
        external_url: user.external_url,
        is_private: user.is_private
    }
}


export async function getPostInfo(photo_cache: string): Promise<PostResponse> {
    let serverResponse = await axios.get(`https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${photo_cache}/`);
    return {
        title: serverResponse.data.title,
        photo_url: serverResponse.data.thumbnail_url
    }
}
