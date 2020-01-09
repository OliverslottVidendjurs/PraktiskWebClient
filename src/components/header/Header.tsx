import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
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
            color: black;
        }
        &:not(:last-of-type){
            margin-right: 10px;
        }
    }
`;

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
`;

const LogoutButton = styled.button`    
    display: block;
    text-decoration: none;
    color: black;
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
    }
`;

const Header = () => {
    const authContext = useContext<IContextType>(AuthContext);
    let location = useLocation();
    if (location.pathname === "/login") return null;
    const clicklogout = () => {
        authContext.logout();
    }
    return (
        <HeaderContainer>
            <nav>
                <List>
                    <li>
                        <Link to="/oversigt">Oversigt</Link>
                    </li>
                    <li>
                        <Link to="/profil">Profil</Link>
                    </li>
                    <li>

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