import styled from "styled-components";

export const Group = styled.div`
    display: block;
    margin-bottom: 15px;
    label {
        display: block;
    }
    input {
        padding: 5px;
    }
`;
export const Button = styled.button`
    cursor: pointer;
    font-size: 20px;
    padding: 5px;
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