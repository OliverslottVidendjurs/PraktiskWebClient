import React, { useContext } from "react";
import { LikeCounter, LikeButton } from "../../styles/styles";
import { AuthContext } from "../contexts/AuthContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

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


interface Props {
    variables: {
        postId?: number,
        commentId?: number
    }
}

const Like = ({variables}: Props) => {
    const authContext = useContext(AuthContext);    
    const [like] = useMutation(LIKE);
    const { data, loading } = useQuery(LIKES, {
        variables
    });

    const handleLikeClick = () => {
        like({
            variables,
            refetchQueries: [{
                query: LIKES,
                variables
            }]
        })
    }

    let LikeButtonConditional = null;
    if (!loading && data.likes) {
        if (data.likes.some((like: any) => like.user_id === authContext.State.id))
            LikeButtonConditional = <LikeButton onClick={handleLikeClick}>Unlike</LikeButton>
        else
            LikeButtonConditional = <LikeButton onClick={handleLikeClick}>Like</LikeButton>
    }
    
    return (
        <div>
            <LikeCounter>{(!loading && data.likes ? data.likes.length : null)}</LikeCounter>
            {LikeButtonConditional}
        </div>
    )
}

export default Like;