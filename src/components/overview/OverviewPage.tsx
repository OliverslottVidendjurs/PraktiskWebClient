import React from "react";
import AddPost from "./AddPost";
import styled from "styled-components";
import Friends from "../friends/Friends";
import AllPosts from "./AllPosts";

const Container = styled.div`
    margin-top: 20px;
`;

const FlexWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Left = styled.div`
    width: 60%;
`;

const Right = styled.div`
    width: 30%;
`;

const OverviewPage = () => {
    return (
        <Container>
            <AddPost />
            <FlexWrapper>
                <Left>
                    <AllPosts />
                </Left>
                <Right>
                    <Friends />
                </Right>
            </FlexWrapper>
        </Container>
    )
}

export default OverviewPage;