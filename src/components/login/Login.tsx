import React, { useState, FormEvent, useContext } from "react";
import { Group, Button, Header, CreateUserButton } from "../../styles/styles";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";

const ComponentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`;

const Login = () => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const authContext = useContext(AuthContext);
    document.title = "Login";
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (username && password) {
            authContext.login(username, password);
        } else {
            alert("Felterne skal udfyldes!");
        }
    }

    return (
        <ComponentWrapper>
            <div>
                <form onSubmit={handleSubmit}>
                    <Header>Login</Header>
                    <Group>
                        <label htmlFor="username">Brugernavn</label>
                        <input autoFocus name="username" id="username" type="text" onChange={(e) => setUsername(e.target.value)} />
                    </Group>
                    <Group>
                        <label htmlFor="password">Password</label>
                        <input name="password" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                    </Group>
                    <Button>Login</Button>
                </form>
                <Group>
                    <CreateUserButton to="/register">Opret ny bruger</CreateUserButton>
                </Group>
            </div>
        </ComponentWrapper>
    )
}

export default Login;