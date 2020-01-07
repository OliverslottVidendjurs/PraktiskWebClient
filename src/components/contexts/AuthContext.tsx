import React, { createContext, useReducer, useEffect, useCallback, useState } from "react";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Redirect, useLocation } from "react-router-dom";

//https://www.sumologic.com/blog/react-hook-typescript/
type Action =
    | { type: "login", data: State }
    | { type: "logout" }
    | { type: "getInfo" }
    | { type: "login2" };

type State = {
    id: number,
    name: string,
    authenticated: boolean | null
}
const initialState: State = {
    id: 0,
    name: "",
    authenticated: null
}

const LOGOUT = gql`
    mutation Logout{
        logout
    }
`;

const USER = gql`
	query user{
		user{
			id,
			firstname,
			lastname
		}
	}
`;

export type IContextType = {
    State: State,
    Action: React.Dispatch<Action>,
    reload: () => void,
    loading: boolean,
    logout: () => void
}


//https://codesandbox.io/s/react-typescript-juf1h
const AuthContext = createContext<IContextType>({
    State: initialState,
    Action: () => { },
    reload: () => { },
    loading: true,
    logout: () => { }
});


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "login":
            return { ...state, name: action.data.name, id: action.data.id, authenticated: action.data.authenticated };
        case "logout":
            console.log("logout");
            return initialState;
        case "login2":
            return { ...state, authenticated: true }
        default:
            return state;
    }
}

const AuthContextProvider = (props: any) => {
    const [logout, { client }] = useMutation(LOGOUT);
    const [redirect, setRedirect] = useState<boolean>(false);
    const [auth, dispatch] = useReducer(reducer, initialState);
    const [loadUser, { called, loading, data }] = useLazyQuery(USER);
    let location = useLocation();

    const reload = useCallback(() => {
        loadUser();
    }, [loadUser]);

    useEffect(() => {
        setRedirect(false);
    }, [redirect]);

    const logoutCallback = useCallback(() => {
        logout().then(() => {
            client?.clearStore();
            dispatch({type: "logout"});
            setRedirect(true);
        }).catch(error => {
            alert(error);
        });
    }, [client, logout]);

    useEffect(() => {
        if (location.pathname !== "/login") {
            reload();
        }

    }, [location.pathname, reload]);

    useEffect(() => {
        if (called && !loading) {
            console.log(data);
            if (data) {
                dispatch(
                    {
                        type: "login",
                        data: {
                            id: data.user.id,
                            name: `${data.user.firstname} ${data.user.lastname}`,
                            authenticated: true
                        }
                    });
            }
        }
    }, [data, called, loading, location.pathname]);
    return (
        <AuthContext.Provider value={{ State: auth, Action: dispatch, reload, loading: loading, logout: logoutCallback }}>
            {redirect ? <Redirect to="/login" /> : null}
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }