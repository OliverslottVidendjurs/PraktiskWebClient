import React, { useContext, useState, useEffect, FormEvent } from 'react'
import { AuthContext, IContextType } from '../contexts/AuthContext'
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Posts from '../overview/Posts';
import { useParams } from 'react-router-dom';
import { USERBYID } from '../../schema/schema';
import { countryList } from '../../other/other';
import { ReactComponent as EditIcon } from "../../gfx/icon-edit.svg";

const EditButton = styled.button`
    cursor: pointer;
    border: none;
    margin-left: 5px;
    background: none;
    &:focus {
        outline: none;
    }
`;

const EditIconStyled = styled(EditIcon)`
    width: 25px;
    .primary {
        fill: #2c3fc7;
    }
`;

const Dropdown = styled.select`
    padding: 3px;
    font-size: 20px;
    max-width: 250px;
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
    @media (max-width: 850px){
        flex-direction: column;
        width: 100%;
        margin-bottom: 20px;
    }
`;

const RightWrapper = styled.div`
    width: 50%;
    @media (max-width: 850px){
        flex-direction: column;
        width: 100%;
    }
`;

const ComponentWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 40px;
    margin: auto;
    max-width: 960px;
    @media (max-width: 850px){
        flex-direction: column;
    }
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

interface DropdownType {
    id: string,
    list: string[],
    defaultValue: string,
    submit: (e: FormEvent) => void
}

interface User {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    country: string
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
        setIsOwner(parseInt(id!) === authContext.State.id)
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

    document.title = "Profil";

    const handleCountrySubmit = (e: FormEvent) => {
        const dropdownElm = (e.target as HTMLSelectElement);
        editUser({
            variables: {
                id: parseInt(id!),
                country: dropdownElm.value
            },
            refetchQueries: [{
                query: USERBYID,
                variables: {
                    id: parseInt(id!)
                }
            }]
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

    const inputFields: InputFieldType[] = [{
        id: "name",
        value: `${data?.userById.firstname} ${data?.userById.lastname}`,
        type: "text",
        submit: handleNameSubmit
    }, {
        id: "email",
        value: data !== undefined ? data.userById.email : "",
        type: "email",
        submit: handleEmailSubmit
    }];

    const dropDowns: DropdownType[] = [{
        id: "country",
        list: countryList,
        defaultValue: `${data?.userById.country}`,
        submit: handleCountrySubmit,
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
        if (!isOwner)
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
                    <EditIconStyled />
                </EditButton>
            );
        }
        return null;
    }

    const InputFields = inputFields.map((elm: InputFieldType) => {
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

    const Dropdowns = dropDowns.map((dropdown: DropdownType) => {
        if (!isOwner) {
            return (
                <span key={dropdown.id}>{dropdown.defaultValue}</span>
            );
        }

        const List = dropdown.list.map(elm => {
            return (
                <option key={elm} value={elm}>{elm}</option>
            )
        });
        return (
            <Dropdown key={dropdown.id} value={dropdown.defaultValue} onChange={dropdown.submit}>
                {List}
            </Dropdown>
        )
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
                {Dropdowns}
            </LeftWrapper>
            <RightWrapper>
                <Posts id={data?.userById.id!} />
            </RightWrapper>
        </ComponentWrapper>
    )
}

export default Profile