import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { userType } from "../../types/post";
import { GETFRIENDS } from "../../schema/schema";
import styled from "styled-components";
import Searchbar from "./Searchbar";
import Friend from "./Friend";

const Container = styled.div`
    margin-bottom: 25px;
`;

const HeaderTitle = styled.h3`
    margin-bottom: 20px;
    text-align: center;
`;

const FriendsWrapper = styled.ul`
    list-style: none;
`;

const Friends = () => {
    const { data, loading } = useQuery(GETFRIENDS);
    
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
        return <div>Henter venner...</div>
    }
    return (
        <Container>
            <HeaderTitle>Venner</HeaderTitle>
            <Searchbar/>
            <FriendsWrapper>
                {FriendList}
            </FriendsWrapper>
        </Container>
    );
}

export default Friends;