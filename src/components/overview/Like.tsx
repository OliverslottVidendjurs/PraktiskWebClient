import React, { useContext } from "react";
import { LikeCounter, LikeButton } from "../../styles/styles";
import { AuthContext } from "../contexts/AuthContext";
import { ILike } from "../../types/Like";

interface Props {
    likes: ILike[],
    submitLike: () => void
}

const Like = ({ likes, submitLike }: Props) => {
    const authContext = useContext(AuthContext);

    const hasLiked = likes.some((like) => like.user_id === authContext.State.id);

    return (
        <div>
            <LikeCounter>{likes.length}</LikeCounter>
            <LikeButton onClick={submitLike}>{hasLiked ? "Unlike" : "Like"}</LikeButton>
        </div>
    )
}

export default Like;