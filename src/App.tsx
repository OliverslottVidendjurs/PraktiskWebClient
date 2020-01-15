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
import { ChatContextProvider } from './components/contexts/ChatContext';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Friends from './components/friends/Friends';

console.log(process.env.NODE_ENV);

const uploadLink = createUploadLink({
	uri: process.env.NODE_ENV === "production" ? "http://oliverslott.com:5000/graphql" : "http://localhost:5000/graphql",
	credentials: "include"
});
export let subscriptionClient = new SubscriptionClient(
	process.env.NODE_ENV === "production" ? "wss://oliverslott.com:5000/graphql" : "ws://localhost:5000/graphql" ,
	{
		reconnect: true
	}
);

const wsLink = new WebSocketLink(subscriptionClient);

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
	/* margin: 0 auto;
	max-width: 1200px; */
`;

const FlexWrapper = styled.div`
    display: flex;
`;

const Left = styled.div`
    width: 100%;
	margin-right: 10px;
`;

const Right = styled.div`
	margin-left: 10px;
	border-left: 1px solid black;
	background-color: #f9f9f9;
`;


const App: React.FC = () => {
	return (
		<ApolloProvider client={client}>
			<AppContainer className="App">
				<BrowserRouter basename={process.env.PUBLIC_URL}>
					<AuthContextProvider>
						<Switch>
							<Route path="/login" component={LoginPage} />
							<Route path="/register" component={Register} />
							<Main>
								<ChatContextProvider>
									<Header />
									<FlexWrapper>
										<Left>
											<Route path="/oversigt" component={OverviewPage}></Route>
											<Route path="/profil/:id" component={Profile}></Route>
										</Left>
										<Right>
											<Friends />
										</Right>
									</FlexWrapper>
								</ChatContextProvider>
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
	if (authContext.authenticated === null) return null;
	if (authContext.authenticated === false) return <Redirect to="/login" />
	return (
		<div>
			{children}
		</div>
	)
}

export default App;
