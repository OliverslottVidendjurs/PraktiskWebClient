import React, { useContext } from "react";
import { postType } from "../../types/post";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { DELETEPOST, GETPOSTS } from "../../schema/schema";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

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

const Post = ({ post }: propType) => {
    const [deletePost] = useMutation(DELETEPOST);
    const authContext = useContext(AuthContext);
    const handleDeleteClick = () => {
        deletePost({
            variables: {
                id: post.id
            },
            refetchQueries: [{
                query: GETPOSTS
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
                    <PosterName><Link to={`/profil/${post.user.id}`}>{post.user.firstname} {post.user.lastname}</Link></PosterName>
                    <TimeStamp>{new Date(parseInt(post.date)).toLocaleString()}</TimeStamp>
                </Header>
                {ImageConditional()}
                <Content>{post.content}</Content>
            </ContentWrapper>
            {DeleteButtonConditional()}
        </PostWrapper>
    )
}

export default Post;