export type PostResponse = {
    title?: string,
    contents: Array<Content>,
    user_tags: Array<string | null>
}


type Content = {
    content_url: string,
    media_type: number
}


export type ProfileResponse = {
    username: string,
    full_name?: string,
    profile_pic_url: string,
    media_count: number,
    follower_count: number,
    following_count: number,
    biography?: string,
    external_url?: string,
    is_private: boolean
}


export type StoriesResponse = {
    link_to_content: string,
    mentions: Array<string | null>,
    media_type: number,
    pk: number,
    id: string
}
