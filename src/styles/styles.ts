import styled from "styled-components";
import { Link } from "react-router-dom";

export const Group = styled.div`
    display: block;
    margin-bottom: 15px;
    max-width: 370px;
    width: 100%;

    font-size: 24px;
    label {
        display: block;
        width: 100%;
        font-size: 24px;
        margin-bottom: 8px;
    }
    input {
        padding: 8px;
        width: 100%;
        border: 1px solid #00000066;
        border-radius: 6px;
        font-size: 24px;
    }
    select {
        padding: 8px;
        width: 100%;
        font-size: 24px;
        border: 1px solid #00000066;
        border-radius: 6px;
    }
`;

export const Header = styled.h1`
    text-align: center;
    margin-bottom: 10px;
`;

export const ButtonGroup = styled.div`
    display: block;
    max-width: 370px;
    width: 100%;
`;

export const Button = styled.button`
    cursor: pointer;
    font-size: 20px;
    width: 100%;
    background-color: #5656f3;
    color: white;
    border: none;
    padding: 11px 0;
    &:hover {
        background-color: #2a2aff;;
    }
`;

export const ButtonLink = styled(Link)`
    display: block;
    font-size: 20px;
    width: 100%;
    background-color: #5656f3;
    color: white;
    border: none;
    padding: 11px 0;
    text-decoration: none;
    text-align: center;
    margin-top: 15px;
    &:hover {
        background-color: #2a2aff;;
    }
`;

export const BackButton = styled(Link)`
    font-size: 20px;
    width: 100%;
    color: #5f5f5f;;
    border: none;
    padding: 11px 0;
    text-decoration: none;
    display: block;
    text-align: center;
    &:hover {
        text-decoration: underline;
    }
`;

export const CreateUserButton = styled(Link)`
    font-size: 20px;
    width: 100%;
    color: #5f5f5f;;
    border: none;
    padding: 11px 0;
    text-decoration: none;
    display: block;
    text-align: center;
    border: 1px solid black;
    margin-top: 13px;
    &:hover {
        text-decoration: underline;
    }
`;

export const DeleteButton = styled.button`
    cursor: pointer;
    border: none;
    background: none;
    height: 100%;
    margin-left: 20px;
    &:hover {
        background-color: #d4d4d4;
    }
    padding: 5px;
`;

export const LikeButton = styled.button`
    cursor: pointer;
    border: none;
    background: none;
    font-size: 18px;
    background-color: #2c3fc7;
    color: white;
    padding: 2px 8px;
    margin: 5px;
    transition: 0.2s;
    &:hover {
        background-color: blue;
    }
`;

export const LikeCounter = styled.span`
    font-size: 24px;
    margin-right: 5px;
`;