import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
// import ApolloClient from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "@apollo/react-hooks";
import Register from './components/register/Register';
import OverviewPage from './components/overview/OverviewPage';
import styled from 'styled-components';
import Header from './components/header/Header';
import { AuthContextProvider, AuthContext } from './components/contexts/AuthContext';
import Profile from './components/profile/Profile';
import "../node_modules/@fortawesome/fontawesome-free/css/all.css";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities";
import Chat from './components/chat/Chat';


const uploadLink = createUploadLink({
	uri: "http://localhost:4000/graphql",
	credentials: "include"
});

const wsLink = new WebSocketLink({
	uri: "ws://localhost:4000/graphql",
	options: {
		reconnect: true
	}
});

const link = split(({ query }) => {
	const definition = getMainDefinition(query);
	return (
		definition.kind === "OperationDefinition" &&
		definition.operation === "subscription"
	)
},
	wsLink,
	uploadLink);

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link
});

const AppContainer = styled.div`
	margin: 0 auto;
	max-width: 1200px;
`;


const App: React.FC = () => {
	return (
		<ApolloProvider client={client}>
			<AppContainer className="App">
				<BrowserRouter basename="/praktisk/">
					<AuthContextProvider>
						<Switch>
							<Route path="/login" component={LoginPage} />
							<Route path="/register" component={Register} />
							<Main>
								<Chat />
								<Header />
								<Route path="/oversigt" component={OverviewPage}></Route>
								<Route path="/profil/:id" component={Profile}></Route>
							</Main>
						</Switch>
					</AuthContextProvider>
				</BrowserRouter>
			</AppContainer>
		</ApolloProvider>
	);
}

const Main = ({ children }: any) => {
	const authContext = useContext(AuthContext);
	console.log(authContext.authenticated);
	if(authContext.authenticated === null) return null;
	if(authContext.authenticated === false) return <Redirect to="/login" />
	return (
		<div>
			{children}
		</div>
	)
}

export default App;
