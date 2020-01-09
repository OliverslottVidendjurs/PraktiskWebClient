import React, { FormEvent, useState, KeyboardEvent } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { GETPOSTS } from "../../schema/schema";

const TextArea = styled.textarea`
    width: 100%;
    font-size: 24px;
    padding: 10px;
    margin-bottom: 5px;
    resize: none;
`;

const Button = styled.button`
    font-size: 24px;
    cursor: pointer;
    width: 100px;
    height: 50px;
    border: none;
    background-color: #2c3fc7;
    color: white;
    border-radius: 6px;
    transition: 0.2s;
    &:hover {
        background-color: blue;
    }
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ADDPOST = gql`
    mutation AddPost($content: String, $img: String) {
        addPost(content: $content, img: $img){
            id
        }
    }
`;

const AddPost = () => {
    const [message, setMessage] = useState<string>("");
    const [addpost] = useMutation(ADDPOST);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (message === "") {
            alert("Feltet kan ikke være tomt!");
        } else {
            addpost({
                variables: {
                    content: message,
                    img: ""
                },
                refetchQueries: [{
                    query: GETPOSTS
                }]
            });
            setMessage("");
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            if (message === "") {
                alert("Feltet kan ikke være tomt!");
            } else {
                addpost({
                    variables: {
                        content: message,
                        img: ""
                    },
                    refetchQueries: [{
                        query: GETPOSTS
                    }]
                });
                setMessage("");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextArea onKeyUp={handleKeyDown} onChange={(e) => setMessage(e.target.value)} value={message} />
            <FlexContainer>
                <Button>Opret</Button>
            </FlexContainer>
        </form>
    )
}

export default AddPost;