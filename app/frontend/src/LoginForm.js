import React from 'react';
import {Form, Button} from 'semantic-ui-react';

export default class LoginForm extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			email:"",
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
			email:this.state.email,
			password:this.state.password,
		}

		if ((user.email.length < 4) || user.password.length < 8) {
			alert("Email must be atleast four characters and password eight characters long.");
			return;
		}
		this.props.login(user);
	}

	render() {
		return (

			<Form onSubmit={this.onSubmit}>

				<Form.Field>
					<label htmlFor="username">Email:</label>
					<input type="text"
							name="email"
							required="required"
							onChange={this.onChange}
							value={this.state.email}/>
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