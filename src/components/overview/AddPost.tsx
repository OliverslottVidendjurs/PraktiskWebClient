import React, { FormEvent, useState, KeyboardEvent, useContext } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { GETPOSTS, GETPOSTSBYID } from "../../schema/schema";
import { AuthContext } from "../contexts/AuthContext";

const TextArea = styled.textarea`
    width: 100%;
    font-size: 24px;
    padding: 10px;
    margin-bottom: 5px;
    resize: none;    
    border: 1px solid #00000066;
    border-radius: 6px;
`;

const Button = styled.button`
    font-size: 24px;
    cursor: pointer;
    width: 150px;
    height: 50px;
    border: none;
    background-color: #2c3fc7;
    color: white;
    transition: 0.2s;
    &:hover {
        background-color: blue;
    }
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
`;

const ADDPOST = gql`
    mutation AddPost($content: String, $img: String) {
        addPost(content: $content, img: $img){
            id
        }
    }
`;

const UPLOADIMG = gql`
    mutation singleUpload($file: Upload!) {
        singleUpload(file: $file)
    }
`;

const AddImageButton = styled.input`
    width: 100%;
`;

const AddPost = () => {
    const [message, setMessage] = useState<string>("");
    const [addpost] = useMutation(ADDPOST);
    const authContext = useContext(AuthContext);
    const [uploadImg] = useMutation(UPLOADIMG, {
        onCompleted(data) {
            setFilename(data.singleUpload);
        }
    });
    const [filename, setFilename] = useState<string>("");
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        createPost();
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            createPost();
        }
    }

    const createPost = () => {
        if (message === "") {
            alert("Feltet kan ikke være tomt!");
        } else {
            console.log(filename);
            addpost({
                variables: {
                    content: message,
                    img: filename
                },
                refetchQueries: [{
                    query: GETPOSTS
                }, {
                    query: GETPOSTSBYID,
                    variables: {
                        id: authContext.State.id
                    }
                }]
            });
            setMessage("");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextArea onKeyUp={handleKeyDown} onChange={(e) => setMessage(e.target.value)} value={message} />
            <FlexContainer>
                <AddImageButton type="file" onChange={({ target: { validity, files: [file] } }) => {
                    validity.valid && uploadImg({ variables: { file } })
                }
                } />
                <Button>Opret</Button>
            </FlexContainer>
        </form>
    )
}

export default AddPost;