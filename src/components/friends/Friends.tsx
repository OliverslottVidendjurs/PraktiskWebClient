import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { userType } from "../../types/post";

const GETFRIENDS = gql`
    query friends {
        friends {
            id
            firstname
            lastname
        }
    }
`;

const Friends = () => {
    const { data, loading } = useQuery(GETFRIENDS);
    const removeFriend = (id: number) => {
        console.log(`Remove friend ${id}`);
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
    return (
        <div>
            <h3>Venner</h3>
            <ul>
                {FriendList}
            </ul>
        </div>
    );
}

export default Friends;