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

interface PropType {
    friend: userType
} 


const REMOVEFRIEND = gql`
    mutation removeFriend($id: Int){
        removeFriend(id: $id)
    }
`;

const Friend = ({friend}: PropType) => {
    const [removeFriendMutation] = useMutation(REMOVEFRIEND);
    const removeFriend = (id: number) => {
        removeFriendMutation({
            variables: {
                id
            },
            refetchQueries: [{ query: GETFRIENDS }, { query: GETPOSTS }]
        })
    }
    return (
        <FriendContainer>
            <div>
                <Link to={`/profil/${friend.id}`}>
                    {friend.firstname} {friend.lastname}
                </Link>
                <button onClick={() => removeFriend(friend.id)}>Fjern ven</button>
            </div>
        </FriendContainer>
    )
}

export default Friend;