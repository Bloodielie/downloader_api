export type PostResponse = {
    title: string | null,
    photo_url: string
}


export type ProfileResponse = {
    username: string,
    full_name: string | null,
    profile_pic_url: string,
    media_count: number,
    follower_count: number,
    following_count: number,
    biography: string | null,
    external_url: string | null,
    is_private: boolean
}
