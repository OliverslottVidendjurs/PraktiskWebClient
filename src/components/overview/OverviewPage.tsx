import React from "react";
import Posts from "./Posts";
import AddPost from "./AddPost";
import styled from "styled-components";
import Friends from "../friends/Friends";

const Container = styled.div`
    margin-top: 20px;
`;

const OverviewPage = () => {
    return (
        <Container>
            <AddPost/>
            <Posts/>
            <Friends/>
        </Container>
    )
}

export default OverviewPage;