import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext, IContextType } from "../contexts/AuthContext";

const List = styled.ul`
    list-style: none;
    display: flex;
    li {
        font-size: 20px;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        a {
            display: block;
            text-decoration: none;
            color: white;
        }
        &:not(:last-of-type){
            margin-right: 10px;
        }
    }
`;

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    background-color: #2c3fc7;
`;

const LogoutButton = styled.button`    
    display: block;
    text-decoration: none;
    color: white;
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;
`;

const FlexWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    a {
        line-height: 60px;
        margin-right: 30px;
        text-decoration: none;
        color: black;
        font-size: 20px;
        color: white;
    }
`;

const Header = () => {
    const authContext = useContext<IContextType>(AuthContext);
    const clicklogout = () => {
        authContext.logout();
    }
    return (
        <HeaderContainer>
            <nav>
                <List>
                    <li>
                        <Link to="/">Oversigt</Link>
                    </li>
                </List>
            </nav>
            <FlexWrapper>
                <Link to={`/profil/${authContext.State.id}`}>
                    {`${authContext.State.firstname} ${authContext.State.lastname}`}
                </Link>
                <LogoutButton onClick={clicklogout}>Log ud</LogoutButton>
            </FlexWrapper>
        </HeaderContainer>
    )
}

export default Header;