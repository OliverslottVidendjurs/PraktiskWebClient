import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import Post from "./Post";
import { postType } from "../../types/post";
import { GETPOSTSBYID } from "../../schema/schema";

interface PostsData {
    postsById: postType[]
}

interface PropsType {
    id: number
}

const Posts = ({id}: PropsType) => {
    const { data, loading } = useQuery<PostsData>(GETPOSTSBYID, {variables: {
        id
    }});
    if (loading) {
        return (
            <div>Henter opslag...</div>
        )
    } else {
        const PostList = data?.postsById?.slice().reverse().map(post => {
            return (
                <Post key={post.id} post={post} />
            )
        });
        return (
            <ul>
                {PostList}
            </ul>
        )
    }
}

export default Posts;