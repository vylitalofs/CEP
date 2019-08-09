import React from 'react';
import {Form, Button, Grid} from 'semantic-ui-react';

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

		if (user.email.length < 4 || user.password.length < 8) {
			alert("Email must be atleast four characters and password eight characters long.");
			return;
		}
		this.props.login(user);
	}

	render() {
		return (

			<Form onSubmit={this.onSubmit} style={{left: "25%"}}>

				<Form.Field>
				<div class="ui left icon input">		
					<input type="text"
						name="email"
						placeholder="Email"
						required="required"
						onChange={this.onChange}
						value={this.state.email}/>
					<i class="mail icon"></i>
				</div>
				</Form.Field>

				<Form.Field>
				<div class="ui left icon input">	
					<input type="password"
						name="password"
						placeholder="Password"
						required="required"
						onChange={this.onChange}
						value={this.state.password}/>
					<i class="lock icon"></i>
				</div>
				</Form.Field>
				
				<Grid>
					<Grid.Column textAlign="center">
						<Button primary onClick={this.login}>Login</Button>
					</Grid.Column>
				</Grid>
			</Form>

		)
	}

}