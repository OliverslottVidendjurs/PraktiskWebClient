export interface ILike {
    id: number,
    post_id: number,
    user_id: number,
    comment_id: number,
    created: string
}

export interface ILikeData {
    likes: ILike[]
}