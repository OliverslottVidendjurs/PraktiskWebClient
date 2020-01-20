import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext, IContextType } from "../contexts/AuthContext";

const List = styled.ul`
    list-style: none;
    display: flex;
    justify-content: space-between;
    width: 100%;
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
            line-height: 60px;
            margin-right: 30px;
            text-decoration: none;
            font-size: 20px;
            color: white;
            @media (max-width: 700px) {
                margin: 0;
            }
        }
        &:not(:last-of-type){
            margin-right: 10px;
            @media (max-width: 700px) {
                margin: 0;
            }
        }
    }
    @media (max-width: 700px) {
        flex-direction: column;
    }
`;

const HeaderContainer = styled.header`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    background-color: #2c3fc7;
    transition: 0.2s;
    @media (max-width: 700px) {
        position: fixed;   
        transform: translateX(-100%);
        &.show {
            transform: translateX(0);
        }
    }
`;

const LogoutButton = styled.button`    
    display: block;
    text-decoration: none;
    color: white;
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;
    height: 100%;
`;

const FlexWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    a {
        
    }
    button {
        text-align: left;
    }
    @media (max-width: 700px) {
        flex-direction: column;
    }
`;

const MenuButton = styled.button`
    z-index: 2;
    padding: 5px 10px;
    background: none;
    border: none;
    i {
        font-size: 50px;
    }
    &:focus {
        outline: none;
    }
`;

const Nav = styled.nav`
    width: 100%;
`;

const ComponentWrapper = styled.div`
    width: 100%;
    @media (max-width: 700px) {
        position: fixed;
    }
`;

const MobileHeader = styled.div`
    background-color: #2c3fc7;
    display: none;
    width: 100%;
    @media (max-width: 700px){
        display: block;
    }
`;

const Header = () => {
    const authContext = useContext<IContextType>(AuthContext);
    const headerRef = useRef<HTMLHeadElement>(null);
    const [menuShowing, setMenuShowing] = useState<boolean>(false);

    const clicklogout = () => {
        authContext.logout();
    }

    const openMenu = () => {
        if (menuShowing) {
            setMenuShowing(false);
            headerRef.current?.classList.remove("show");
        } else {
            setMenuShowing(true);
            headerRef.current?.classList.add("show");
        }
    }

    return (
        <ComponentWrapper>
            <MobileHeader>
                <MenuButton onClick={openMenu}>
                    <i className="fas fa-bars"></i>
                </MenuButton>
            </MobileHeader>
            <HeaderContainer ref={headerRef}>
                <Nav>
                    <List>
                        <li>
                            <Link to="/">Oversigt</Link>
                        </li>
                        <FlexWrapper>
                            <li>
                                <Link to={`/profil/${authContext.State.id}`}>
                                    {`${authContext.State.firstname} ${authContext.State.lastname}`}
                                </Link>
                            </li>
                            <li>
                                <LogoutButton onClick={clicklogout}>Log ud</LogoutButton>
                            </li>
                        </FlexWrapper>
                    </List>
                </Nav>
            </HeaderContainer>
        </ComponentWrapper>
    )
}

export default Header;