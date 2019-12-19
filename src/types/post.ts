export interface postType {
    id: number,
    user_id: number,
    content: string,
    img: string,
    date: string,
    user: userType
}

export interface userType {
    id: number,
    firstname: string,
    lastname: string
}