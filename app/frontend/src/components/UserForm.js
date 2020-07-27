import React from 'react';
import {Form, Button, Header, Grid} from 'semantic-ui-react';

export default class UserForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			firstName:"",
			lastName:"",
			email:"",
			accessLevel:"1",
			password:"",
			confirmPassword:"",
			edit:false,
			remove:false,
			lastId:this.props.id
		}
	}

	componentDidMount() {
		// Get user data if we got an id as props
		if (this.props.id) {
			this.getUser();
		}
	}

	componentDidUpdate() {
		// Got a userid as props?
		if (this.props.id !== this.state.lastId) {
			// then reset state
			this.resetState();
			// and get the users info
			if (this.props.id) {
				this.getUser();
			}
		}
	}

	resetState() {
		this.setState({
			firstName:"",
			lastName:"",
			email:"",
			accessLevel:"1",
			password:"",
			confirmPassword:"",
			edit:false,
			remove:false,
			lastId:this.props.id
		})
	}

	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}

	getUser = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token}
		}

		fetch("/api/user/" + this.props.id, request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.setState(data)
				}).catch(error => {
					console.log("Error in parsing response json")
				});
			}
			else {
				console.log("Server responded with status: " + response.statusText);
			}
		}).catch(error => {
			console.log(error);
		})
	}

	createUser = (user) => {
		let request = {
			method:"POST",
			mode:"cors",
			headers:{"Content-Type":"application/json", token:this.props.token},
			body:JSON.stringify(user)
		}

		fetch("/api/user/create", request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.props.history.push("/user/"+data.userId);
				})
			} else {
				alert("User creation failed.");
				console.log("Server responded with status: " + response.status);
			}
		}).catch(error => {
			alert("User creation failed.");
			console.log(error);
		})
	}

	putUser = (user) => {
		let request = {
			method:"PUT",
			mode:"cors",
			headers:{"Content-Type":"application/json", token:this.props.token},
			body:JSON.stringify(user)
		}

		fetch("/api/user/" + this.props.id, request).then(response => {
			if (response.ok) {
				this.getUser()
			}
			else {
				response.json().then(data => {
					alert(data.message);
				})
				console.log("Server responded with status: " + response.status);
			}
		}).catch(error => {
			console.log(error);
		})
	}

	removeUser = () => {
		let request = {
			method:"DELETE",
			mode:"cors",
			headers:{"Content-Type":"application/json", token:this.props.token},
		}

		fetch("/api/user/" + this.props.id, request).then(response => {
			if (response.ok) {
				this.props.history.push("/users");
			}
			else {
				console.log("Server responded with status: " + response.status);
			}
		}).catch(error => {
			console.log(error);
		})
	}
	
	onSubmit = (event) => {
		event.preventDefault();

		if (this.state.remove) {
			this.removeUser();
			return;
		}

		if (this.state.firstName === "") {
			alert("First name required.");
			return;
		}

		if (this.state.lastName === "") {
			alert("Last name required.");
			return;
		}

		if (this.state.email === "") {
			alert("Email required.");
			return;
		}

		if (this.state.password !== this.state.confirmPassword) {
			alert("Passwords don't match.");
			return;
		}

		let user = {
			firstName:this.state.firstName,
			lastName:this.state.lastName,
			email:this.state.email,
			accessLevel:this.state.accessLevel,
			password:this.state.password,
		}

		if (this.state.edit) {
			this.putUser(user);
		}
		else {
			this.createUser(user);
		}

		this.resetState();
	}

	enableRemove = () => {
		this.setState({
			remove:true
		})
	}

	enableEdit = () => {
		this.setState({
			edit:true
		})
	}

	cancelUpdate = () => {
		this.setState({
			edit:false,
			remove:false
		})
	}

	render() {
		// Are we creating a new user or viewing an existing one
		let newUser = !this.props.id;

		// Define styles for toggling forms
		let enableInputs = newUser || this.state.edit;
		let showInputs = !enableInputs ? {display:'none'} : {};

		let title = newUser ? 'NEW USER' : 'USER OVERVIEW'
		let submit = this.state.edit ? 'Update' : 'Remove'

		return (
			<Form>
				<Header textAlign='center'>{title}</Header>

				<Form.Group widths='equal'>
					<Form.Field>
						<label htmlFor="firstName">First name:</label>
						<input type="text"
							   name="firstName"
							   disabled={!enableInputs}
							   onChange={this.onChange}
							   value={this.state.firstName}/>
					</Form.Field>

					<Form.Field>
						<label htmlFor="lastName">Last name:</label>
						<input type="text"
							   name="lastName"
							   disabled={!enableInputs}
							   onChange={this.onChange}
							   value={this.state.lastName}/>
					</Form.Field>
				</Form.Group>

				<Form.Group widths='equal'>
					<Form.Field>
						<label htmlFor="email">Email:</label>
						<input type="text"
							   name="email"
							   disabled={!enableInputs}
							   onChange={this.onChange}
							   value={this.state.email}/>
					</Form.Field>
				</Form.Group>

				<Form.Group>
					<Form.Field>
						<label htmlFor="accessLevel">Access rights:</label> 
						<select name="accessLevel"
								className="ui dropdown"
								onChange={this.onChange}
								disabled={!(enableInputs && this.props.accessLevel > 2)}
								inputtype="hidden"
								value={this.state.accessLevel}>

								<option value="0">Disabled</option>
								<option value="1">Basic user</option>
								<option value="2">Manager</option>
								<option value="3">Admin</option>
						</select>
					</Form.Field>
				</Form.Group>

				<Form.Group grouped style={showInputs}>
					<Form.Field>
						<label htmlFor="password">Password:</label>
						<input type="password"
							   name="password"
							   disabled={!enableInputs}
							   onChange={this.onChange}
							   value={this.state.password}/>
					</Form.Field>
					
					<Form.Field>
						<label htmlFor="confirmPassword">Confirm password:</label>
						<input type="password"
							   name="confirmPassword"
							   disabled={!enableInputs}
							   onChange={this.onChange}
							   value={this.state.confirmPassword}/>
					</Form.Field>
				</Form.Group>

				<br/>
				<Grid>
					<Grid.Column>

						{(!newUser && (this.state.edit || this.state.remove)) &&
							<div>
								<Button onClick={this.onSubmit} floated='right'>{submit}</Button>
								<Button onClick={this.cancelUpdate} floated='right'>Cancel</Button>
							</div>
						}

						{(!newUser && !this.state.edit && !this.state.remove) &&
							<div>
								<Button onClick={this.enableEdit} floated='right'>Edit</Button>
							</div>
						}

						{(!newUser && !this.state.edit && !this.state.remove && this.props.accessLevel > 2) &&
							<div>
								<Button onClick={this.enableRemove} floated='right'>Remove</Button>
							</div>
						}

						{newUser &&
							<Button onClick={this.onSubmit} floated='right'>Submit</Button>
						}

					</Grid.Column>
				</Grid>
			</Form>
		)
	}
}