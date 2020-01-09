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
    margin-bottom: 10px;
`;

const Input = styled.input`
    padding: 3px;
`;

const AddButton = styled.button`
    padding: 3px;
    cursor: pointer;
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


const ADDFRIEND = gql`
    mutation addFriend($id: Int){
        addFriend(id: $id)
    }
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

    // const handleInputChange = (e: FormEvent) => {
    //     const elm = (e.target as HTMLInputElement);
    //     setFriendName(elm.value);
    //     if (elm.value === "") {
    //         dropdownElm.current!.style.display = "none";
    //     } else {
    //         dropdownElm.current!.style.display = "block";
    //     }
    // }

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
            <label htmlFor="">Tilføj ven: </label>
            <Input ref={inputElm} list="list" onChange={(e) => setFriendName(e.target.value)} value={friendName} type="text" />
            <Dropdown ref={dropdownElm}>
                <ul>
                    {FriendOptions()}
                </ul>
            </Dropdown>
            <AddButton>Tilføj</AddButton>
        </SearchBar>
    )
}

export default Searchbar;