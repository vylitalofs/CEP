import React from 'react';
import {Form, Button} from 'semantic-ui-react';

export default class LoginForm extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			username:"",
			password:""
		}
	}

	onChange = (event) => {
		//console.log(event.target)
		let state = {}
		state[event.target.name] = event.target.value;
		this.setState(state);
	}

	login = (event) => {
		event.preventDefault();
		let user = {
			username:this.state.username,
			password:this.state.password,
		}

		if (user.username.length < 4 || user.password.length < 4) {
			alert("Username must be atleast four characters and password eight characters long.");
			return;
		}
		this.props.login(user);
	}

	render() {
		return (

			<Form onSubmit={this.onSubmit}>

				<Form.Field>
					<label htmlFor="username">Username:</label>
					<input type="text"
							name="username"
							required="required"
							onChange={this.onChange}
							value={this.state.username}/>
				</Form.Field>

				<Form.Field>
					<label htmlFor="password">Password:</label>
					<input type="password"
							name="password"
							required="required"
							onChange={this.onChange}
							value={this.state.password}/>
				</Form.Field>

				<Button onClick={this.login}>Login</Button>

			</Form>

		)
	}

}