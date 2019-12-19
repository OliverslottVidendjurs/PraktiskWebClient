import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import Register from './components/register/Register';
import OverviewPage from './components/overview/OverviewPage';
import styled from 'styled-components';
import Header from './components/header/Header';

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql",
	credentials: "include"
});

const AppContainer = styled.div`
	margin: 0 auto;
	max-width: 1200px;
`;

const App: React.FC = () => {
	return (
		<ApolloProvider client={client}>
			<AppContainer className="App">
				<BrowserRouter>
					<Header />
					<Route exact path="/" component={LoginPage} />
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={Register} />
					<Route path="/oversigt" component={OverviewPage}></Route>
				</BrowserRouter>
			</AppContainer>
		</ApolloProvider>
	);
}

export default App;
