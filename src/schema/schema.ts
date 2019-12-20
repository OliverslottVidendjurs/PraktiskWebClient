import { gql } from "apollo-boost";

export const GETPOSTS = gql`
    query posts {
        posts {
            id
            user_id
            content
            img
            date
            user {
                id
                firstname
                lastname
            }
        }
    }
`;

export const DELETEPOST = gql`
    mutation deletePost($id: Int) {
        deletePost(id: $id)
    }
`;

export const GETFRIENDS = gql`
    query friends {
        friends {
            id
            firstname
            lastname
        }
    }
`;