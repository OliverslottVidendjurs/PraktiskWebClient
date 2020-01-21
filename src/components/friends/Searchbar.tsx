import React, { useState, FormEvent, useRef, useEffect, useContext } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { GETFRIENDS, GETPOSTS } from "../../schema/schema";
import { userType } from "../../types/post";
import { AuthContext } from "../contexts/AuthContext";


const GETALLUSERS = gql`
    query users {
        users {
            id
            firstname
            lastname
        }
    }
`;

const SearchBar = styled.form`
    position: relative;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 5px;
    border: 1px solid #00000066;
    border-radius: 0;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    font-size: 18px;
    width: 100%;
    &:focus {
        outline: none;
    }
`;

const AddButton = styled.button`
    padding: 5px;
    cursor: pointer;
    background-color: #2c3fc7;
    color: white;
    border: none;
    border-right: 1px solid #00000066;
    border-top: 1px solid #00000066;
    border-bottom: 1px solid #00000066;
    border-radius: 0;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    font-size: 18px;
`;

const Dropdown = styled.div`
    position: absolute;
    display: none;
    border: 1px solid black;
    border-radius: 3px;
    background-color: #8080804f;
    padding: 5px;
    ul {
        list-style: none;
        li {
            button {
                cursor:pointer;
                width: 100%;
                height: 30px;
                
            }
            &:not(:last-of-type){
                margin-bottom: 5px;
            }
        }
    }
`;

const FlexWrapper = styled.div`
    display: flex;
`;


const ADDFRIEND = gql`
    mutation addFriend($id: Int){
        addFriend(id: $id)
    }
`;

const Title = styled.label`
    margin-bottom: 5px;
    display: block;
`;

const Searchbar = () => {
    const [friendName, setFriendName] = useState<string>("");
    const { data, loading } = useQuery(GETALLUSERS);
    const [addFriendMutation] = useMutation(ADDFRIEND);
    const datalistElm = useRef<HTMLDataListElement>(null);
    const inputElm = useRef<HTMLInputElement>(null);
    const dropdownElm = useRef<HTMLDivElement>(null);
    const authContext = useContext(AuthContext);
    const addFriendSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(datalistElm.current!.innerText);
    }

    useEffect(() => {
        const inputXPos = inputElm.current!.offsetLeft;
        dropdownElm.current!.style.left = inputXPos + "px";
        dropdownElm.current!.style.width = inputElm.current!.getBoundingClientRect().width + "px";
    }, []);

    useEffect(() => {
        if (friendName === "") {
            dropdownElm.current!.style.display = "none";
        } else {
            dropdownElm.current!.style.display = "block";
        }
    }, [friendName]);

    const handleFriendSelect = (id: number) => {
        addFriendMutation({
            variables: {
                id
            },
            refetchQueries: [{ query: GETFRIENDS }, { query: GETPOSTS }]
        }).catch(err => {
            alert(err);
        });
        setFriendName("");
    }

    const FriendOptions = () => {
        if (!loading) {
            if (data) {
                return data.users.filter((user: any) =>
                    (`${user.firstname} ${user.lastname}`).toLocaleLowerCase().includes(friendName.toLocaleLowerCase())
                    && user.id !== authContext.State.id).map((user: userType) => {
                        return (
                            <li key={user.id}>
                                <button onClick={() => handleFriendSelect(user.id)} type="button">{user.firstname} {user.lastname}</button>
                            </li>
                        )
                    });
            }
        }
        return null;
    }

    return (
        <SearchBar onSubmit={addFriendSubmit}>
            <Title htmlFor="searchbar">Tilføj ven: </Title>
            <FlexWrapper>
                <Input id="searchbar" ref={inputElm} list="list" onChange={(e) => setFriendName(e.target.value)} value={friendName} type="text" />
                <AddButton>Tilføj</AddButton>
            </FlexWrapper>
            <Dropdown ref={dropdownElm}>
                <ul>
                    {FriendOptions()}
                </ul>
            </Dropdown>
        </SearchBar>
    )
}

export default Searchbar;