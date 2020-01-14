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
    const { data, loading, refetch } = useQuery<PostsData>(GETPOSTSBYID, {variables: {
        id
    }});
    useEffect(() => {
        refetch();
    }, [refetch, id]);
    if (loading) {
        return (
            <div>Henter opslag...</div>
        )
    } else {
        const PostList = data?.postsById?.slice().sort((a, b) => { return parseInt(b.date) - parseInt(a.date)}).map(post => {
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