import React, { useContext } from "react";
import { postType } from "../../types/post";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DELETEPOST, GETPOSTS, GETPOSTSBYID } from "../../schema/schema";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { gql } from "apollo-boost";

interface propType {
    post: postType
}

const DeleteButton = styled.button`
    cursor: pointer;
    border: none;
    background: none;
    height: 100%;
    margin-left: 20px;
    &:hover {
        background-color: #d4d4d4;
    }
    padding: 5px;
`;

const ContentWrapper = styled.div`
    width: 100%;
`;

const PostWrapper = styled.li`
    display: flex;
    justify-content: space-between;
    /* max-width: 500px; */
    border: 1px solid #00000066;
    margin-bottom: 25px;
    padding: 18px;
    border-radius: 6px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
`;

const PosterName = styled.p`
    font-size: 22px;
    a {
        text-decoration: none;
        color: black;
    }
`;

const TimeStamp = styled.p`
    color: #000000a8;
`;

const Content = styled.p`
    line-height: 1.5;
    font-size: 20px;
`;

const Img = styled.img`
    width: 100%;
`;

const InteractionWrapper = styled.div`
    display: flex;
    margin-top: 15px;
    padding-top: 5px;
    border-top: 1px solid black;
`;

const LikeButton = styled.button`
    cursor: pointer;
    border: none;
    background: none;
    font-size: 24px;
`;

const LikeCounter = styled.span`
    font-size: 24px;
    margin-right: 5px;
`;

const LIKES = gql`
    query likes($postId: Int) {
        likes(postId: $postId) {
            id
        }
    }
`;

const LIKEPOST = gql`
    mutation likePost($id: Int) {
        likePost(id: $id)
    }
`;

const Post = ({ post }: propType) => {
    const [deletePost] = useMutation(DELETEPOST);
    const { data, loading } = useQuery(LIKES, {
        variables: {
            postId: post.id
        }
    });
    const [likePost] = useMutation(LIKEPOST);
    const authContext = useContext(AuthContext);
    const handleDeleteClick = () => {
        deletePost({
            variables: {
                id: post.id
            },
            refetchQueries: [{
                query: GETPOSTS
            }, {
                query: GETPOSTSBYID,
                variables: {
                    id: post.user_id
                }
            }]
        });
    }

    const DeleteButtonConditional = () => {
        if (post.user_id === authContext.State.id)
            return (
                <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
            );
        return null;
    }

    const ImageConditional = () => {
        if (!post.img)
            return null;

        return (
            <Img src={`/images/${post.img}`} alt="img" />
        )
    }

    return (
        <PostWrapper>
            <ContentWrapper>
                <Header>
                    <PosterName><Link to={`/profil/${post.user_id}`}>{post.user.firstname} {post.user.lastname}</Link></PosterName>
                    <TimeStamp>{new Date(parseInt(post.date)).toLocaleString()}</TimeStamp>
                </Header>
                {ImageConditional()}
                <Content>{post.content}</Content>
                <InteractionWrapper>
                    <LikeCounter>{(!loading && data.likes ? data.likes.length : null)}</LikeCounter>
                    <LikeButton onClick={() => likePost({
                        variables: {
                            id: post.id
                        },
                        refetchQueries: [{
                            query: LIKES,
                            variables: {
                                postId: post.id
                            }
                        }]
                    })}>Like</LikeButton>
                </InteractionWrapper>
            </ContentWrapper>
            {DeleteButtonConditional()}
        </PostWrapper>
    )
}

export default Post;