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
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities";
import { ChatContextProvider } from './components/contexts/ChatContext';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Friends from './components/friends/Friends';
import moment from "moment";
import "moment/locale/da";
moment.locale("da");

console.log(process.env.NODE_ENV);

const uploadLink = createUploadLink({
	uri: process.env.NODE_ENV === "production" ? "https://www.oliverslott.com/graphql" : "http://localhost:5000/graphql",
	credentials: "include"
});
export let subscriptionClient = new SubscriptionClient(
	process.env.NODE_ENV === "production" ? "wss://www.oliverslott.com/graphql" : "ws://localhost:5000/graphql",
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
	@media (max-width: 700px) {
		padding-top: 50px;
	}
`;

const Left = styled.div`
    width: 100%;
	margin-right: 10px;
	@media (max-width: 700px) {
        margin: 0;
    }
`;

const Right = styled.div`
	margin-left: 10px;
	border-left: 1px solid black;
	background-color: #f9f9f9;
	max-width: 300px;
    width: 100%;
	@media (max-width: 700px) {
		/* margin: 0; */
		display: none;
    }
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
									<Switch>
										<Route path="/venner" component={Friends} ></Route>
										<FlexWrapper>
											<Left>
												<Route exact path="/" component={OverviewPage}></Route>
												<Route path="/profil/:id" component={Profile}></Route>

											</Left>
											<Right>
												<Friends />
											</Right>
										</FlexWrapper>
									</Switch>
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
