import React, { FormEvent, useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components";
import { gql, ApolloClient, InMemoryCache, NormalizedCacheObject } from "apollo-boost";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import { IChatContextType, ChatContext } from "../contexts/ChatContext";
import { WebSocketLink } from "apollo-link-ws";

const ChatContainer = styled.div`
    position: fixed;
    width: 400px;
    height: 400px;
    right: 0;
    bottom: 0;
    border: 1px solid #00000066;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #f3f3f3;
    z-index: 9999;
    display: flex;
    flex-direction: column;
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

const ADD_MESSAGE = gql`
    mutation addMessage($toId: Int, $content: String) {
        addMessage(toId: $toId, content: $content) 
    }
`;

const MESSAGES = gql`
    query messages($friendId: Int) {
        messages(friendId: $friendId) {
            id,
            from_user {
                firstname,
                lastname
            },
            to_user {
                firstname,
                lastname
            },
            content,
            created
        }
    }
`;

const MESSAGE_SUBSCRIPTION = gql`
    subscription onMessageAdded {
        messageAdded {
            id,
            from_user {
                firstname,
                lastname
            },
            to_user {
                firstname,
                lastname
            },
            content,
            created
        }
    }
`;
let client: ApolloClient<NormalizedCacheObject>;
const Chat = () => {
    //I'm sorry for my sins..
    if(!client){
       client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new WebSocketLink({
                uri: "ws://localhost:4000/graphql"
            })
        })
    }
    const chatContext = useContext<IChatContextType>(ChatContext);
    useSubscription(MESSAGE_SUBSCRIPTION, {
        onSubscriptionData: ({ subscriptionData }) => {
            setMessages([...messages, subscriptionData.data.messageAdded]);
        },
        shouldResubscribe: true,
        client
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
            <p key={message.id}><b>{message.from_user.firstname}:</b> {message.content}</p>
        )
    });

    
    if(chatContext.currentlyChattingId === null) return null;

    return (
        <ChatContainer>
            <MessagesContainer ref={messageContainerRef}>
                {MessagesList}
            </MessagesContainer>
            <ChatFieldForm onSubmit={handleSubmit}>
                <ChatField onChange={(e) => setNewMessage(e.target.value)} value={newMessage}>

                </ChatField>
                <SendMessageButton>
                    Send
                </SendMessageButton>
            </ChatFieldForm>
        </ChatContainer>
    )
}

export default Chat;