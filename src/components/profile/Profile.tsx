import React, { useContext, useState, useEffect } from 'react'
import { AuthContext, IContextType } from '../contexts/AuthContext'
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Posts from '../overview/Posts';
import { useParams } from 'react-router-dom';
import { USERBYID } from '../../schema/schema';

const EditButton = styled.button`
    cursor: pointer;
    border: none;
    margin-left: 5px;
    background: none;
    &:focus {
        outline: none;
    }
`;

const Input = styled.input`
    font-size: 20px;
`;

const NameText = styled.span`
    font-size: 20px;
`;

const InputWrapper = styled.div`
    display: block;
    margin-bottom: 10px;
`;

const LeftWrapper = styled.div`
    width: 50%;
`;

const RightWrapper = styled.div`
    width: 50%;
`;

const ComponentWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const EDITUSER = gql`
    mutation editUser($id: Int, $username: String, $password: String, $email: String, $firstname: String, $lastname: String, $country: String) {
        editUser(id: $id, username: $username, password: $password, email: $email, firstname: $firstname, lastname: $lastname, country: $country) {
            id
        }
    }
`;

interface InputFieldType {
    id: string,
    value: string,
    type: string,
    submit: () => void
}

interface User {
    id: number,
    firstname: string,
    lastname: string,
    email: string
}

interface PostData {
    userById: User
}

const Profile = () => {
    const authContext = useContext<IContextType>(AuthContext);
    const [editing, setEditing] = useState<boolean>(false);
    const [newText, setNewText] = useState<string>("");
    const [currentInputId, setCurrentInputId] = useState<string>("");
    const { id } = useParams();
    const [editUser] = useMutation(EDITUSER);
    const { data, loading } = useQuery<PostData>(USERBYID, {
        variables: {
            id: parseInt(id!)
        }
    });
    const [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        if (parseInt(id!) === authContext.State.id) {
            setIsOwner(true);
        }
    }, [isOwner, id, authContext.State.id]);

    const handleNameSubmit = () => {
        let nameArray = newText.split(" ");
        let firstname = nameArray[0];
        let lastname = nameArray.slice(1).join(" ");
        editUser({
            variables: {
                id: parseInt(id!),
                firstname: firstname,
                lastname: lastname
            }
        }).then(() => {
            authContext.reload();
        });
    }

    const handleEmailSubmit = () => {
        editUser({
            variables: {
                id: parseInt(id!),
                email: newText
            }
        }).then(() => {
            authContext.reload();
        });
    }

    const thingy: InputFieldType[] = [{
        id: "name",
        value: `${data?.userById.firstname} ${data?.userById.lastname}`,
        type: "text",
        submit: handleNameSubmit
    }, {
        id: "email",
        value: data !== undefined ? data.userById.email : "",
        type: "email",
        submit: handleEmailSubmit
    }, {
        id: "adresse",
        value: "Århus",
        type: "text",
        submit: () => { }
    }];

    useEffect(() => {
        setNewText(`${data?.userById.firstname} ${data?.userById.lastname}`);
    }, [data])

    const handleNameKeyPress = (e: any, callback: () => void) => {
        if (e.key === "Enter") {
            setEditing(false);
            callback();

        } else if (e.key === "Escape") {
            setEditing(false);
        }
    }

    useEffect(() => {
        const click = (e: any) => {
            if (editing && e.target !== document.querySelector(`#${currentInputId}`)) {
                setEditing(false);
            }
        }
        window.addEventListener("click", click);
        return (() => {
            window.removeEventListener("click", click);
        });
    }, [editing, currentInputId]);

    useEffect(() => {
        if (editing) {
            document.querySelector<HTMLInputElement>(`#${currentInputId}`)?.focus();
        }
    }, [editing, currentInputId]);

    const handleClick = (id: string, defaultValue: string) => {
        if(!isOwner)
            return;
        
        setEditing(true);
        setCurrentInputId(id);
        setNewText(defaultValue);
    }

    const handleOnChange = (e: any) => {
        setNewText(e.target.value);
    }

    const EditButtonConditional = (elm: InputFieldType) => {
        if (isOwner) {
            return (
                <EditButton onClick={() => handleClick(elm.id, elm.value)}>
                    <i className="fas fa-edit"></i>
                </EditButton>
            );
        }
        return null;
    }

    const InputFields = thingy.map((elm: InputFieldType) => {
        if (editing && currentInputId === elm.id) {
            return (
                <InputWrapper key={elm.id}>
                    <Input key={elm.id} id={elm.id} onKeyDown={(e) => handleNameKeyPress(e, elm.submit)} onChange={handleOnChange} type={elm.type} value={newText} />
                </InputWrapper>
            )
        } else {
            return (
                <InputWrapper key={elm.id}>
                    <NameText id={elm.id} onClick={() => handleClick(elm.id, elm.value)}>
                        {elm.value}
                    </NameText>
                    {EditButtonConditional(elm)}
                </InputWrapper>
            );
        }
    });


    if (loading) {
        return (
            <div>Henter data..</div>
        )
    }

    return (
        <ComponentWrapper>
            <LeftWrapper>
                {InputFields}
            </LeftWrapper>
            <RightWrapper>
                <Posts id={data?.userById.id!} />
            </RightWrapper>
        </ComponentWrapper>
    )
}

export default Profile