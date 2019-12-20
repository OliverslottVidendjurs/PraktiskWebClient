import React, { useState, FormEvent } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Group, Button } from "../../styles/styles";
import { Redirect, Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const LOGIN = gql`
        mutation Login($username: String, $password: String){
            login(username: $username, password: $password){
                email
            }
        }
    `;

    const [login, { client }] = useMutation(LOGIN);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (username && password) {
            login({
                variables: {
                    username,
                    password
                }
            }).then(res => {
                client?.clearStore();
                setLoggedIn(true);
            }).catch(err => {
                alert(err);
            });
        } else {
            alert("Felterne skal udfyldes!");
        }
    }

    return (
        <div>
            {loggedIn ? <Redirect to="/oversigt"/> : null}
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <Group>
                    <label htmlFor="username">Brugernavn</label>
                    <input name="username" id="username" type="text" onChange={(e) => setUsername(e.target.value)} />
                </Group>
                <Group>
                    <label htmlFor="password">Password</label>
                    <input name="password" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                </Group>
                <Button>Login</Button>
            </form>
            <Link to="/register">Opret ny bruger</Link>
        </div>
    )
}

export default Login;