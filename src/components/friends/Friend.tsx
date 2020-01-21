import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { userType } from "../../types/post";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { GETPOSTS, GETFRIENDS } from "../../schema/schema";
import { IChatContextType, ChatContext } from "../contexts/ChatContext";
import { ReactComponent as ChatIcon } from "../../gfx/icon-chat.svg";
import { ReactComponent as RemoveUserIcon } from "../../gfx/icon-user-remove.svg"


const FriendContainer = styled.li`
    margin-bottom: 10px;
    display: flex;
`;

const RemoveFriendButton = styled.button`
    cursor: pointer;
    padding: 3px;
    margin-left: 5px;
    background: none;
    border: none;
    &:hover {
        svg {
            .primary {
                fill: red;
            }
        }
    }
`;

const OpenChatButton = styled.button`
    cursor: pointer;
    padding: 3px;
    margin-left: 5px;
    background: none;
    border: none;
    &:hover {
        svg {
            .primary {
                fill: blue;
            }
        }
    }
`;

interface PropType {
    friend: userType
}


const REMOVEFRIEND = gql`
    mutation removeFriend($id: Int){
        removeFriend(id: $id)
    }
`;

const FriendName = styled.span`
    align-self: center;
    a {
        color: black;
        font-size: 20px;
        text-decoration: none;
    }
`;

const ChatIconStyled = styled(ChatIcon)`
    width: 25px;
    .primary {
        fill: #2c3fc7;
    }
    .secondary {
        fill: #ffffff;   
    }
`;

const RemoveUserIconStyled = styled(RemoveUserIcon)`
    width: 25px;
    .primary {
        fill: #e65963;
    }
    .secondary {
        fill: #e65963;
    }
`;

const Friend = ({ friend }: PropType) => {
    const [removeFriendMutation] = useMutation(REMOVEFRIEND);
    const chatContext = useContext<IChatContextType>(ChatContext);
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
            <FriendName>
                <Link to={`/profil/${friend.id}`}>
                    {friend.firstname} {friend.lastname}
                </Link>
            </FriendName>

            <RemoveFriendButton onClick={() => removeFriend(friend.id)}>
                <RemoveUserIconStyled />
            </RemoveFriendButton>

            <OpenChatButton onClick={() => chatContext.openChat(friend.id)}>
                <ChatIconStyled />
            </OpenChatButton>
        </FriendContainer>
    )
}

export default Friend;