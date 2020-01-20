import React, { useState, FormEvent, useContext } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Group, Button, BackButton, ButtonGroup, Header } from "../../styles/styles";
import styled from "styled-components";
import { countryList } from "../../other/other";
import { AuthContext } from "../contexts/AuthContext";

const ComponentWrapper = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`;

const Register = () => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [firstname, setFirstname] = useState<string>();
    const [lastname, setLastname] = useState<string>();
    const [country, setCountry] = useState<string>(countryList[0]);

    const REGISTER = gql`
        mutation register($username: String, $password: String, $email: String, $firstname: String, $lastname: String, $country: String) {
            register(username: $username, password: $password, email: $email, firstname: $firstname, lastname: $lastname, country: $country){
                id
            }
        }
    `;

    const [register] = useMutation(REGISTER);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        register({
            variables: {
                username,
                password,
                email,
                firstname,
                lastname,
                country
            }
        }).then(() => {
            if (username && password)
                authContext.login(username, password);
        }).catch(err => {
            alert(err);
        });
    }
    const List = countryList.map(elm => {
        return (
            <option key={elm} value={elm}>{elm}</option>
        )
    });

    return (
        <ComponentWrapper onSubmit={handleSubmit}>
            <Header>Opret bruger</Header>
            <Group>
                <label htmlFor="username">Brugernavn</label>
                <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" />
            </Group>
            <Group>
                <label htmlFor="email">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" />
            </Group>
            <Group>
                <label htmlFor="firstname">Fornavn</label>
                <input onChange={(e) => setFirstname(e.target.value)} type="text" name="firstname" id="firstname" />
            </Group>
            <Group>
                <label htmlFor="lastname">Efternavn</label>
                <input onChange={(e) => setLastname(e.target.value)} type="text" name="lastname" id="lastname" />
            </Group>
            <Group>
                <label htmlFor="country">Land</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {List}
                </select>
            </Group>
            <Group>
                <label htmlFor="password">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" />
            </Group>
            <Group>
                <label htmlFor="passwordAgain">Gentag password</label>
                <input type="password" name="passwordAgain" id="passwordAgain" />
            </Group>
            <ButtonGroup>
                <Button>Opret</Button>
            </ButtonGroup>
            <ButtonGroup>
                <BackButton to="/login">Tilbage til login</BackButton>
            </ButtonGroup>
        </ComponentWrapper>
    )
}

export default Register;