import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { userType } from "../../types/post";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { GETPOSTS, GETFRIENDS } from "../../schema/schema";


const FriendContainer = styled.li`
    margin-bottom: 10px;
`;

const RemoveFriendButton = styled.button`
    cursor: pointer;
    padding: 3px;
    margin-left: 5px;
`;

interface PropType {
    friend: userType
}


const REMOVEFRIEND = gql`
    mutation removeFriend($id: Int){
        removeFriend(id: $id)
    }
`;

const Friend = ({ friend }: PropType) => {
    const [removeFriendMutation] = useMutation(REMOVEFRIEND);
    const removeFriend = (id: number) => {
        if (window.confirm(`Er du sikker på at du ville fjerne ${friend.firstname} ${friend.lastname} som din ven?`)) {
            removeFriendMutation({
                variables: {
                    id
                },
                refetchQueries: [{ query: GETFRIENDS }, { query: GETPOSTS }]
            })
        }
    }
    return (
        <FriendContainer>
            <div>
                <Link to={`/profil/${friend.id}`}>
                    {friend.firstname} {friend.lastname}
                </Link>
                <RemoveFriendButton onClick={() => removeFriend(friend.id)}>Fjern ven</RemoveFriendButton>
            </div>
        </FriendContainer>
    )
}

export default Friend;