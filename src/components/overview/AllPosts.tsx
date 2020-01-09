import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Post from "./Post";
import { postType } from "../../types/post";
import { GETPOSTS } from "../../schema/schema";

interface PostsData {
    posts: postType[]
}

const AllPosts = () => {
    const { data, loading } = useQuery<PostsData>(GETPOSTS);
    if (loading) {
        return (
            <div>Henter opslag...</div>
        )
    } else {
        console.log(data);
        const PostList = data?.posts?.slice().reverse().map(post => {
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

export default AllPosts;