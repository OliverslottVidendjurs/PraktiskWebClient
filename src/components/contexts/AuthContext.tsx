import React, { createContext, useReducer, useEffect, useCallback, useState } from "react";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Redirect, useLocation } from "react-router-dom";
import { USER } from "../../schema/schema";

//https://www.sumologic.com/blog/react-hook-typescript/
type Action =
    | { type: "login", data: State }
    | { type: "logout" }
    | { type: "getInfo" };

type State = {
    id: number,
    firstname: string,
    lastname: string,
    email: string
}
const initialState: State = {
    id: 0,
    firstname: "",
    lastname: "",
    email: ""
}

const LOGOUT = gql`
    mutation Logout{
        logout
    }
`;

const LOGIN = gql`
    mutation Login($username: String, $password: String){
        login(username: $username, password: $password){
            email,
            id,
            firstname,
            lastname
        }
    }
`;

export type IContextType = {
    State: State,
    Action: React.Dispatch<Action>,
    logout: () => void,
    login: (username: string, password: string) => void,
    reload: () => void,
    authenticated: boolean | null
}


//https://codesandbox.io/s/react-typescript-juf1h
const AuthContext = createContext<IContextType>({
    State: initialState,
    Action: () => { },
    logout: () => { },
    login: () => { },
    reload: () => { },
    authenticated: null
});


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "login":
            return {
                ...state,
                firstname: action.data.firstname,
                lastname: action.data.lastname,
                id: action.data.id,
                email: action.data.email
            };
        case "logout":
            return initialState;
        default:
            return state;
    }
}

const AuthContextProvider = (props: any) => {
    const [logout, { client }] = useMutation(LOGOUT);
    const [login] = useMutation(LOGIN);
    const [redirect, setRedirect] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [auth, dispatch] = useReducer(reducer, initialState);
    const [loadUser, { called, loading, data, error, refetch }] = useLazyQuery(USER);
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    let location = useLocation();

    const loginCallback = (username: string, password: string) => {
        login({
            variables: {
                username,
                password
            }
        }).then(res => {
            client?.resetStore();
            setLoggedIn(true);
        }).catch(err => {
            alert(err);
        });
    }

    const reload = () => {
        refetch();
    }

    const logoutCallback = useCallback(() => {
        logout().then(() => {
            client?.clearStore();
            setRedirect(true);
            setAuthenticated(null);
            dispatch({ type: "logout" });
        }).catch(error => {
            alert(error);
        });
    }, [client, logout]);

    useEffect(() => {
        //Only check authentication when not on the login page
        if (location.pathname !== "/login" && location.pathname !== "/register") {
            loadUser();
        }
    }, [location.pathname, loadUser]);

    useEffect(() => {
        setRedirect(false);
        setLoggedIn(false);
    }, [redirect, loggedIn]);

    useEffect(() => {
        if (called && !loading) {
            if (error) {
                //User is not logged in, send them back to login site
                setRedirect(true);                
                setAuthenticated(false);
            }

            if (data) {
                setAuthenticated(true);
                dispatch(
                    {
                        type: "login",
                        data: {
                            id: data.user.id,
                            firstname: data.user.firstname,
                            lastname: data.user.lastname,
                            email: data.user.email
                        }
                    });
            }
        }
    }, [data, called, loading, error])

    return (
        <AuthContext.Provider value={{
            State: auth,
            Action: dispatch,
            logout: logoutCallback,
            login: loginCallback,
            reload: reload,
            authenticated
        }}>
            {redirect ? <Redirect to="/login" /> : null}
            {loggedIn ? <Redirect to="/oversigt" /> : null}
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }