import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {Segment} from 'semantic-ui-react';
import TopBar from './components/TopBar';
import NavBar from './components//NavBar';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import CaseList from './components/CaseList';
import CaseForm from './components/CaseForm';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			token:"",
			isLogged:false,
			user:[],
			types:[],
			statuses:[],
			locations:[]
		}
	}

	componentDidMount() {
		if (sessionStorage.getItem("state")) {
			let tempState = JSON.parse(sessionStorage.getItem("state"));
			this.setState(tempState);
		}
	}

	componentDidUpdate() {
		// Get case location, type, status lists on update if we don't have them
		if (!this.state.isLogged) {
			return;
		}
		
		if (this.state.types.length < 1) {
			this.getTypes();
		}

		if (this.state.locations.length < 1) {
			this.getLocations();
		}

		if (this.state.statuses.length < 1) {
			this.getStatuses();
		}
	}

	saveToStorage = () => {
		sessionStorage.setItem("state", JSON.stringify(this.state));
	}

	getLocations = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{
				"Content-Type":"application/json", 
				"token":this.state.token
			}
		}

		fetch("/api/locations", request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.setState({locations:data});
				}).catch(error => {
					console.log("Error in parsing response json");
				});
			}
			else {
				console.log("Server responded with status: " + response.statusText);
			}
		}).catch(error => {
			console.log(error);
		});
	}

	getTypes = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{
				"Content-Type":"application/json",
				"token":this.state.token
			}
		}

		let types;

		fetch("/api/casetypes", request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.setState({types:data});
				}).catch(error => {
					console.log("Error in parsing response json");
				});
			}
			else {
				console.log("Server responded with status: " + response.statusText);
			}
		}).catch(error => {
			console.log(error);
		});

		return types;
	}

	getStatuses = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{
				"Content-Type":"application/json",
				"token":this.state.token
			}
		}

		fetch("/api/casestatuses", request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.setState({statuses:data});
				}).catch(error => {
					console.log("Error in parsing response json");
				});
			}
			else {
				console.log("Server responded with status: " + response.statusText);
			}
		}).catch(error => {
			console.log(error);
		});
	}

	handleStatus = (status) => {
		if (status === 403) {
			this.setState({
				token:"",
				isLogged:false,
				user:[]
			}, () => {this.saveToStorage()});
		}
	}
	
	onLogin = (data) => {
		this.setState({
			isLogged:true,
			token:data.token,
			user:data.user
		}, () => {
			this.saveToStorage();
		});
	}

	logout = () => {
		let request = {
			method:"POST",
			mode:"cors",
			headers:{
				"Content-Type":"application/json",
				"token":this.state.token
			}
		}

		fetch("/logout",request).then(response => {
			if(response.ok) {
				this.setState({
					token:"",
					isLogged:false,
					user:[]
				},() => {this.saveToStorage()});
			}
		}).catch(error => {
			console.log(error);
		});
	}

	render() {
		return (
			<div className="App" style={{width:900, margin:"auto"}}>

				<TopBar isLogged={this.state.isLogged}
						logout={this.logout}
						user={this.state.user}
						style={{maxHeight: "80px"}}
				/>

				<Segment.Group horizontal>

					<NavBar
						isLogged={this.state.isLogged}
						user={this.state.user}
						/>

					<Segment id="main">
						<Switch>
							<Route exact path="/" render={() =>
								!this.state.isLogged ?
									<LoginForm onLogin={this.onLogin}/> :
									<Redirect to="/cases"/>
							}/>

							<Route path="/users" render={() =>
								(this.state.isLogged && this.state.user.accessLevel > 2) ?
									<UserList
										token={this.state.token}
										history={this.props.history}
										accessLevel={this.state.user.accessLevel}/> :
									<Redirect to="/"/>
							}/>

							<Route path="/newuser" render={() =>
								(this.state.isLogged && this.state.user.accessLevel > 2) ?
									<UserForm
										token={this.state.token}
										history={this.props.history}
										accessLevel={this.state.user.accessLevel}/> :
									<Redirect to="/"/>
							}/>

							<Route path="/user/:id" render={({match}) =>
								this.state.isLogged ?
									<UserForm
										id={match.params.id}
										token={this.state.token}
										history={this.props.history}
										accessLevel={this.state.user.accessLevel}/> :
									<Redirect to="/"/>
							}/>

							<Route path="/cases" render={() =>
								this.state.isLogged ?
									<CaseList token={this.state.token}/> :
									<Redirect to="/"/>
							}/>

							<Route path="/newcase" render={() =>
								this.state.isLogged ?
									<CaseForm
										user={this.state.user}
										token={this.state.token}
										types={this.state.types}
										history={this.props.history}
										statuses={this.state.statuses}
										locations={this.state.locations}/> :
									<Redirect to="/"/>
							}/>

							<Route path="/case/:id" render={({match}) =>
								this.state.isLogged ?
									<CaseForm
										id={match.params.id}
										user={this.state.user}
										token={this.state.token}
										types={this.state.types}
										statuses={this.state.statuses}
										locations={this.state.locations}
										history={this.props.history}
										accessLevel={this.state.user.accessLevel}/> :
									<Redirect to="/"/>
							}/>
						</Switch>
					</Segment>
				</Segment.Group>
			</div>
		);
	}
}

export default withRouter(App);