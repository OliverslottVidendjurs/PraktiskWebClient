import React, { useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

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

const LOGOUT = gql`
    mutation Logout{
        logout
    }
`;

const Header = (props: any) => {
    const [logout, { client }] = useMutation(LOGOUT);
    const [loggedOut, setLoggedout] = useState<boolean>(false);
    let location = useLocation(); 
    if(location.pathname === "/login") return null;
    const clicklogout = () => {
        logout().then(() => {
            client?.clearStore();
            setLoggedout(true);
        }).catch(error => {
            alert(error);
        });
    }
    return (
        <HeaderContainer>
            {loggedOut ? <Redirect to="/login" /> : null}
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
            <LogoutButton onClick={clicklogout}>Log ud</LogoutButton>
        </HeaderContainer>
    )
}

export default Header;