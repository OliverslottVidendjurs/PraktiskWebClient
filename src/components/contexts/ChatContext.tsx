import React, { createContext, useState } from "react";
import Chat from "../chat/Chat";

export type IChatContextType = {
    openChat: (userId: number) => void,
    currentlyChattingId: number | null
}

const ChatContext = createContext<IChatContextType>({
    openChat: () => { },
    currentlyChattingId: null
});

const ChatContextProvider = (props: any) => {
    const [currentlyChattingId, setCurrentlyChattingId] = useState<number | null>(null);
    const openChat = (userId: number) => {
        setCurrentlyChattingId(userId);
    }
    return (
        <ChatContext.Provider value={{ openChat, currentlyChattingId }}>
            {currentlyChattingId !== null ? <Chat /> : null}
            {props.children}
        </ChatContext.Provider>
    )
}

export { ChatContext, ChatContextProvider }