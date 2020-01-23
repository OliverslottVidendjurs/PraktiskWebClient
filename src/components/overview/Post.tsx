import React, { useContext } from "react";
import { postType } from "../../types/post";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DELETEPOST, GETPOSTS, GETPOSTSBYID } from "../../schema/schema";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Comments from "./Comments";
import { DeleteButton } from "../../styles/styles";
import Like from "./Like";
import moment from "moment";
import { gql } from "apollo-boost";

interface propType {
    post: postType
}

export const ContentWrapper = styled.div`
    width: 100%;
`;

const PostWrapper = styled.li`
    display: flex;
    justify-content: space-between;
    border: 1px solid #00000066;
    margin-bottom: 25px;
    padding: 18px;
    border-radius: 6px;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
`;

export const PosterName = styled.p`
    font-size: 22px;
    a {
        text-decoration: none;
        color: black;
    }
`;

export const TimeStamp = styled.p`
    color: #000000a8;
    padding: 5px;
`;

const Content = styled.p`
    line-height: 1.5;
    font-size: 20px;
`;

const Img = styled.img`
    width: 100%;
`;

const InteractionWrapper = styled.div`
    margin-top: 15px;
    padding-top: 5px;
    border-top: 1px solid black;
`;

export const RightSideHeader = styled.div`
    display: flex;
`;

const LIKES = gql`
    query likes($postId: Int, $commentId: Int) {
        likes(postId: $postId, commentId: $commentId) {
            id
            user_id
        }
    }
`;

const LIKE = gql`
    mutation like($postId: Int, $commentId: Int){
        like(postId: $postId, commentId: $commentId)
    }
`;


const Post = ({ post }: propType) => {
    const [deletePost] = useMutation(DELETEPOST);
    const authContext = useContext(AuthContext);
    const [like] = useMutation(LIKE);
    const { data: likesData } = useQuery(LIKES, {
        variables: {
            postId: post.id
        }
    });
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

    const handleLikeCallback = () => {
        like({
            variables: {
                postId: post.id
            },
            refetchQueries: [{
                query: LIKES,
                variables: {
                    postId: post.id
                }
            }]
        })
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
                    <RightSideHeader>
                        <TimeStamp title={moment(parseInt(post.date)).format()}>{moment(parseInt(post.date)).fromNow()}</TimeStamp>
                        {DeleteButtonConditional()}
                    </RightSideHeader>
                </Header>
                {ImageConditional()}
                <Content>{post.content}</Content>
                <InteractionWrapper>
                    <Like likes={likesData?.likes ?? []} submitLike={handleLikeCallback} />
                    <Comments postId={post.id}></Comments>
                </InteractionWrapper>
            </ContentWrapper>
        </PostWrapper>
    )
}

export default Post;