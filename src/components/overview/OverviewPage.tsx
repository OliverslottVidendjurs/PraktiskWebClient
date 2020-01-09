import React from "react";
import AddPost from "./AddPost";
import styled from "styled-components";
import Friends from "../friends/Friends";
import AllPosts from "./AllPosts";

const Container = styled.div`
    margin-top: 20px;
`;

const OverviewPage = () => {
    return (
        <Container>
            <AddPost />
            <Friends />
            <AllPosts />
        </Container>
    )
}

export default OverviewPage;