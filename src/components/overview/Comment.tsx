import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { COMMENTS, USERBYID } from "../../schema/schema";
import { IContextType, AuthContext } from "../contexts/AuthContext";
import { gql } from "apollo-boost";
import { DeleteButton } from "../../styles/styles";
import { Link } from "react-router-dom";
import { Header, PosterName, RightSideHeader, TimeStamp, ContentWrapper } from "./Post";
import moment from "moment";
import Like from "./Like";
import { ILikeData } from "../../types/Like";
import { IComment } from "../../types/Comment";

const ComponentWrapper = styled.li`
    border: 1px solid #00000066;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
`;

const Content = styled.p`
    margin-bottom: 10px;
`;

const DELETECOMMENT = gql`
    mutation deleteComment($id: Int) {
        deleteComment(id: $id)
    }
`;

const LIKES = gql`
    query likes($commentId: Int) {
        likes(commentId: $commentId) {
            id
            user_id
        }
    }
`;

const LIKE = gql`
    mutation like($commentId: Int){
        like(commentId: $commentId)
    }
`;

interface IProps {
    comment: IComment
}

const Comment = ({ comment }: IProps) => {
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const { data, loading } = useQuery(USERBYID, {
        variables: {
            id: comment.user_id
        }
    });
    const [like] = useMutation(LIKE);
    const { data: likesData } = useQuery<ILikeData>(LIKES, {
        variables: {
            commentId: comment.id
        }
    });

    const [deleteComment] = useMutation(DELETECOMMENT, {
        variables: {
            id: comment.id
        },
        refetchQueries: [{
            query: COMMENTS,
            variables: {
                postId: comment.post_id
            }
        }]
    });

    const handleLikeCallback = () => {
        like({
            variables: {
                commentId: comment.id
            },
            refetchQueries: [{
                query: LIKES,
                variables: {
                    commentId: comment.id
                }
            }]
        })
    }
    const authContext = useContext<IContextType>(AuthContext);

    useEffect(() => {
        if (authContext.State.id === comment.user_id) {
            setIsOwner(true);
        }
    }, [authContext.State.id, comment]);

    if (loading) return <div>Henter kommentar...</div>

    return (
        <ComponentWrapper>
            <ContentWrapper>
                <Header>
                    <PosterName>
                        <Link to={`/profil/${comment.user_id}`}>{`${data.userById.firstname} ${data.userById.lastname}`}</Link>
                    </PosterName>
                    <RightSideHeader>
                        <TimeStamp title={moment(parseInt(comment.created)).format()}>{moment(parseInt(comment.created)).fromNow()}</TimeStamp>
                        {isOwner ? <DeleteButton onClick={() => deleteComment()}>X</DeleteButton> : null}
                    </RightSideHeader>
                </Header>
                <Content>{comment.content}</Content>
                <Like likes={likesData?.likes ?? []} submitLike={handleLikeCallback}></Like>
            </ContentWrapper>
        </ComponentWrapper>
    )
}

export default Comment;