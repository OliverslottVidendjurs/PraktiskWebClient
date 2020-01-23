export interface IComment {
    id: number,
    post_id: number,
    user_id: number,
    parent_id: number,
    content: string,
    created: string
}

export interface ICommentData {
    comments: IComment[]
}