import React, { FormEvent, useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import { IChatContextType, ChatContext } from "../contexts/ChatContext";
import moment from "moment";
import { AuthContext } from "../contexts/AuthContext";

const ChatContainer = styled.div`
    position: fixed;
    width: 100%;
    max-width: 400px;
    height: 400px;
    bottom: 0;
    right: 305px;
    border: 1px solid #00000066;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #f9f9f9;
    z-index: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @media (max-width: 700px){
        right: 0;
        max-width: 100%;

    }
`;

const ChatField = styled.input`
    width: 100%;
    font-size: 20px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 25px;
    border: 1px solid #00000066;
    margin-left: 5px;
    margin-right: 5px;
    &:focus {
        outline: none;
    }
`;

const SendMessageButton = styled.button`
    cursor: pointer;
    font-size: 15px;
    padding-left: 5px;
    padding-right: 5px;
    margin-right: 5px;
`;

const ChatFieldForm = styled.form`
    display: flex;
    bottom: 5px;
    justify-content: space-between;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
`;

const MessagesContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 15px;
`;

const FriendNameContainer = styled.div`
    padding: 10px;
    border-bottom: 1px solid black;
    background-color: #0a2aa0;
    display: flex;
    justify-content: space-between;
    p {
        font-weight: bold;
        color: white;
    }
`;

const CloseButton = styled.button`
    border: none;
    background: none;
    color: white;
    font-weight: bold;
    padding-left: 5px;
    padding-right: 5px;
    cursor: pointer;
`;

const MessageContainer = styled.div`
    display: flex;
    margin-top: 10px;
    &:not(:last-child){
        margin-bottom: 15px;
    }
`;

const MessageBubble = styled.div`
    display: inline-block;
    padding: 6px 18px;
    background-color: #e0e0e0;
    border-radius: 17px;
`;

const TimeStamp = styled.div`
    font-size: 13px;
    text-align: center;
    color: rgb(95, 95, 95);
`;

const MessageContainer2 = styled.div`
    max-width: 50%;
`;

const ADD_MESSAGE = gql`
    mutation addMessage($toId: Int, $content: String) {
        addMessage(toId: $toId, content: $content) 
    }
`;

const MESSAGES = gql`
    query messages($friendId: Int) {
        messages(friendId: $friendId) {
            id
            from_user {
                firstname
                lastname
            }
            content
            created
            from_user_id
            to_user_id
        }
    }
`;

const MESSAGE_SUBSCRIPTION = gql`
    subscription onMessageAdded {
        messageAdded {
            id
            from_user {
                firstname
                lastname
            },
            to_user {
                firstname
                lastname
            }
            content
            created
            from_user_id
            to_user_id
        }
    }
`;

const GETUSERBYID = gql`
    query userById($id: Int) {
        userById(id: $id) {
            firstname,
            lastname
        }
    }
`;

const Chat = () => {
    const chatContext = useContext<IChatContextType>(ChatContext);
    const authContext = useContext(AuthContext);
    const { data: userData, loading: userLoading } = useQuery(GETUSERBYID, {
        variables: {
            id: chatContext.currentlyChattingId
        }
    });
    useSubscription(MESSAGE_SUBSCRIPTION, {
        onSubscriptionData: ({ subscriptionData }) => {
            setMessages([...messages, subscriptionData.data.messageAdded]);
        },
        shouldResubscribe: true
    });

    const [newMessage, setNewMessage] = useState<string>("");
    const [addMessage] = useMutation(ADD_MESSAGE);
    const [messages, setMessages] = useState<any[]>([]);
    const { data } = useQuery(MESSAGES, {
        variables: {
            friendId: chatContext.currentlyChattingId
        },
        onCompleted: () => {
            console.log(data);
            setMessages(data.messages);
        },
    });

    const messageContainerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        addMessage({
            variables: {
                toId: chatContext.currentlyChattingId,
                content: newMessage
            }
        });
        setNewMessage("");
    }

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight)
        }
    });
    const MessagesList = messages.map((message: any) => {
        return (
            <MessageContainer key={message.id} style={message.from_user_id === authContext.State.id ? { justifyContent: "flex-end" } : {}}>
                <MessageContainer2>
                    <MessageBubble>
                        <p>{message.content}</p>
                    </MessageBubble>
                    <TimeStamp>{moment(parseInt(message.created)).fromNow()}</TimeStamp>
                </MessageContainer2>
            </MessageContainer>
        )
    });
    

    if (chatContext.currentlyChattingId === null) return null;
    return (
        <ChatContainer>
            <FriendNameContainer>
                <p>{(!userLoading && userData) ? `${userData.userById.firstname} ${userData.userById.lastname}` : null}</p>
                <CloseButton onClick={() => chatContext.closeChat()}>X</CloseButton>
            </FriendNameContainer>
            <MessagesContainer ref={messageContainerRef}>
                {MessagesList}
            </MessagesContainer>
            <ChatFieldForm onSubmit={handleSubmit}>
                <ChatField autoFocus onChange={(e) => setNewMessage(e.target.value)} value={newMessage}>

                </ChatField>
                <SendMessageButton>
                    Send
                </SendMessageButton>
            </ChatFieldForm>
        </ChatContainer>
    )
}

export default Chat;