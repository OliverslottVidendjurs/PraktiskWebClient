import React, { FormEvent, useState } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { userType } from "../../types/post";
import { GETPOSTS } from "../../schema/schema";
import styled from "styled-components";

const GETFRIENDS = gql`
    query friends {
        friends {
            id
            firstname
            lastname
        }
    }
`;

const REMOVEFRIEND = gql`
    mutation removeFriend($id: Int){
        removeFriend(id: $id)
    }
`;

const ADDFRIEND = gql`
    mutation addFriend($id: Int){
        addFriend(id: $id)
    }
`;

const Container = styled.div`
    margin-bottom: 25px;
`;

const Friends = () => {
    const [friendName, setFriendName] = useState<string>();
    const { data, loading } = useQuery(GETFRIENDS);
    const [removeFriendMutation] = useMutation(REMOVEFRIEND);
    const [addFriendMutation] = useMutation(ADDFRIEND);
    const removeFriend = (id: number) => {
        removeFriendMutation({
            variables: {
                id
            },
            refetchQueries: [{query: GETFRIENDS}, {query: GETPOSTS}]
        })
    }
    let FriendList;
    if (!loading) {
        if (data) {
            //TODO: Move out to its own component
            FriendList = data.friends.map((friend: userType) => {
                return (
                    <li key={friend.id}>
                        <div>
                            <Link to={`/profil/${friend.id}`}>
                                {friend.firstname} {friend.lastname}
                            </Link>
                            <button onClick={() => removeFriend(friend.id)}>Fjern ven</button>
                        </div>
                    </li>
                )
            });
        }
    } else {
        return <div>Henter venner...</div>
    }
    const addFriendSubmit = (e: FormEvent) => {
        e.preventDefault();
        addFriendMutation({
            variables: {
                id: parseInt(friendName!)
            },
            refetchQueries: [{query: GETFRIENDS}, {query: GETPOSTS}]
        });
        setFriendName("");
    }
    return (
        <Container>
            <h3>Venner</h3>
            <form onSubmit={addFriendSubmit}>
                <label htmlFor="">Tilføj ven: </label>
                <input onChange={(e) => setFriendName(e.target.value)} value={friendName} type="text"/>
                <button>Tilføj</button>
            </form>
            <ul>
                {FriendList}
            </ul>
        </Container>
    );
}

export default Friends;