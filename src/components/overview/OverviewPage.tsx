import React from "react";
import AddPost from "./AddPost";
import styled from "styled-components";
import AllPosts from "./AllPosts";

const Container = styled.div`
    padding-top: 40px;
    margin: auto;
    max-width: 960px;
`;

const FlexWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const OverviewPage = () => {
    return (
        <Container>
            <AddPost />
            <FlexWrapper>
                <AllPosts />
            </FlexWrapper>
        </Container>
    )
}

export default OverviewPage;