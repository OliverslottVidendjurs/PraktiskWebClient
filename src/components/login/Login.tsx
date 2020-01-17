import React, { useState, FormEvent, useContext } from "react";
import { Group, Button } from "../../styles/styles";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";

const ComponentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`;

const Title = styled.h2`
    margin-bottom: 10px;
    text-align: center;
`;

const Login = () => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const authContext = useContext(AuthContext);

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
                <Title>Login</Title>
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
                <Link to="/register">Opret ny bruger</Link>
            </div>
        </ComponentWrapper>
    )
}

export default Login;