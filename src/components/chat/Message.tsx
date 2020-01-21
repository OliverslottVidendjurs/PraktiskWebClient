import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";
import moment from "moment";


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

const Message = ({message}: any) => {
    const authContext = useContext(AuthContext);
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
}

export default Message;