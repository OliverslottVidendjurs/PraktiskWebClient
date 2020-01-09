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

export const USER = gql`
	query user{
		user{
			id,
			firstname,
			lastname,
            email
		}
	}
`;

export const USERBYID = gql`
	query userById($id: Int){
		userById(id: $id){
			id,
			firstname,
			lastname,
            email,
            country
		}
	}
`;

export const GETPOSTSBYID = gql`
    query postsById($id: Int) {
        postsById(id: $id) {
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