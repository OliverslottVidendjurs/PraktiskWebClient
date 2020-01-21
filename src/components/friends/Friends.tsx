import React, { useRef, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { userType } from "../../types/post";
import { GETFRIENDS } from "../../schema/schema";
import styled from "styled-components";
import Searchbar from "./Searchbar";
import Friend from "./Friend";

const Container = styled.div`
    padding: 15px;
    position: sticky;
    top: 0;
    @media (max-width: 700px) {
        /* display: none; */
        padding-top: 65px;
        position: unset;
    }
`;

const HeaderTitle = styled.h3`
    margin-bottom: 10px;
    text-align: center;
`;

const FriendsWrapper = styled.ul`
    list-style: none;
`;

const Friends = () => {
    const { data, loading } = useQuery(GETFRIENDS);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let yPos = containerRef.current?.getBoundingClientRect().y;

        if(containerRef.current && yPos)
            containerRef.current.style.height = (window.innerHeight-yPos) + "px";

        const updateHeight = () => {
            if(containerRef.current && yPos)
            containerRef.current.style.height = (window.innerHeight-yPos) + "px";
        }
        window.addEventListener("resize", updateHeight);
        return (() => {
            window.removeEventListener("resize", updateHeight)
        });
    }, [containerRef]);
    let FriendList;
    if (!loading) {
        if (data) {
            FriendList = data.friends.map((friend: userType) => {
                return (
                    <Friend friend={friend} key={friend.id}/>
                )
            });
        }
    } else {
        FriendList = <div>Henter venner...</div>
    }
    return (
        <Container ref={containerRef}>
            <HeaderTitle>Venner</HeaderTitle>
            <Searchbar/>
            <FriendsWrapper>
                {FriendList}
            </FriendsWrapper>
        </Container>
    );
}

export default Friends;