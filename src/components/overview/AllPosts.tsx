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
        const PostList = data?.posts?.slice().sort((a, b) => { return parseInt(b.date) - parseInt(a.date)}).map(post => {
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