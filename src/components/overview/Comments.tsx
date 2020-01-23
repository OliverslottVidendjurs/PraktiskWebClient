import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Comment from "./Comment";
import { COMMENTS } from "../../schema/schema";
import { ICommentData } from "../../types/Comment";

const CommentsListElm = styled.ul`
    list-style: none;
`;

const ADDCOMMENT = gql`
    mutation addComment($postId: Int, $content: String) {
        addComment(postId: $postId, content: $content) {
            id
        }
    }
`;


const CommentInputField = styled.input`
    border: 1px solid #00000066;
    border-radius: 6px;
    font-size: 22px;
    padding: 5px;
`;

interface IProps {
    postId: number
}

const Comments = ({postId}: IProps) => {
    const [addComment] = useMutation(ADDCOMMENT);
    const [commentText, setCommentText] = useState<string>("");
    const { data: commentsData, loading: commentsLoading } = useQuery<ICommentData>(COMMENTS, {
        variables: {
            postId: postId
        }
    });
    
    let CommentsList: JSX.Element[] = [];
    if (!commentsLoading && commentsData?.comments) {
        CommentsList = commentsData.comments.map(comment => {
            return (
                <Comment key={comment.id} comment={comment}></Comment>
            )
        });
    }    

    const AddComment = (e: FormEvent) => {
        e.preventDefault();
        if(commentText !== ""){
            addComment({
                variables: {
                    postId: postId,
                    content: commentText
                },
                refetchQueries: [{
                    query: COMMENTS,
                    variables: {
                        postId: postId
                    }
                }]
            })
        }
        setCommentText("");
    }

    return (
        <div>
            <div>
                <form onSubmit={AddComment}>
                    <CommentInputField onChange={(e) => setCommentText(e.target.value)} value={commentText} />
                </form>
            </div>
            <CommentsListElm>
                {CommentsList}
            </CommentsListElm>
        </div>
    )
}

export default Comments;