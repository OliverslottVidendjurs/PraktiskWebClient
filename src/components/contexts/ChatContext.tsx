import React, { createContext, useState } from "react";
import Chat from "../chat/Chat";

export type IChatContextType = {
    openChat: (userId: number) => void,
    closeChat: () => void,
    currentlyChattingId: number | null
}

const ChatContext = createContext<IChatContextType>({
    openChat: () => { },
    closeChat: () => { },
    currentlyChattingId: null
});

const ChatContextProvider = (props: any) => {
    const [currentlyChattingId, setCurrentlyChattingId] = useState<number | null>(null);
    const openChat = (userId: number) => {
        setCurrentlyChattingId(userId);
    }

    const closeChat = () => {
        setCurrentlyChattingId(null);
    }
    return (
        <ChatContext.Provider value={{ openChat, currentlyChattingId, closeChat }}>
            {props.children}
            {currentlyChattingId !== null ? <Chat /> : null}
        </ChatContext.Provider>
    )
}

export { ChatContext, ChatContextProvider }