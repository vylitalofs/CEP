import React from 'react';
import {Form,Button, Grid, Header, Table} from 'semantic-ui-react';

export default class UserView extends React.Component {
		
	constructor(props) {
		super(props);
		this.state = {
			firstName:"",
			lastName:"",
			email:"",
			isAdmin:"false",
            password:"",
            confirmPassword:""
		}
	}
	
	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}
	
	
	onSubmit = (event) => {
		event.preventDefault();

		//vikatapaukset
		if (this.state.firstName === "") {
			alert("Add firstName");
			return;
		}
		if (this.state.lastName === "") {
			alert("Add lastName");
			return;
		}
		if (this.state.email.length < 4 || this.state.password.length < 8) {
			alert("Email must be atleast four characters and password eight characters long.");
			return;
		}
		if (this.state.confirmPassword !== this.state.password) {
			alert("Passwords don't match");
			return;
		}
		/*
		editUser = () => {
			let user = {
				firstName:this.state.firstName,
				lastName:this.state.lastName,
				email:this.state.email,
				isAdmin:isAdmin,
				password:this.state.password,
			}
			this.props.editUser(user);
		}
			
		cancel = () => {
			this.props.cancel();
		}

		console.log(user)

		this.setState({
			firstName:"",
			lastName:"",
			email:"",
			isAdmin:"false",
            password:"",
            confirmPassword:""
		})
			*/
	}



	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Header textAlign='center'>USER OVERVIEW</Header>
				<Form.Group widths='equal'>
				<Form.Field>
					<label htmlFor="firstName">First name:</label>
					<input type="text"
                           name="firstName"
                           disabled='true'
						   onChange={this.onChange}
						   value={this.state.firstName}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="lastName">Last name:</label>
					<input type="text"
                           name="lastName"
                           disabled='true'
						   onChange={this.onChange}
						   value={this.state.lastName}/>

				</Form.Field>

				</Form.Group>

				<Form.Group widths='equal'>
				<Form.Field>
					<label htmlFor="email">Email:</label>
					<input type="text"
                           name="email"
                           disabled='true'
						   onChange={this.onChange}
						   value={this.state.email}/>
				</Form.Field>

				</Form.Group>

				<Form.Group>
				<Form.Field>
				<label htmlFor="isAdmin">Access Rights:</label>
				<select name="isAdmin"
						class="ui dropdown"
						input type="hidden" 
                        onChange={this.onChange}
                        disabled='true'
						value={this.state.isAdmin}
						>
						
						<option value="false">Basic user</option>				 		
  				 		<option value="true">Admin</option>
 				</select>
				</Form.Field>

				</Form.Group>
				<Grid>
					<Grid.Column floated= 'right' textAlign='right'>
				
					</Grid.Column>
				</Grid>
				<Form.Group grouped>
                <Form.Field>
					<label htmlFor="password">Password:</label>
					<input type="text"
                           name="password"
                           disabled='true'
                           inputtype= "password"
						   onChange={this.onChange}
						   value={this.state.password}/>
						   
				</Form.Field>
				
                <Form.Field>
					<label htmlFor="confirmPassword">Confirm password:</label>
					<input type="text"
                           name="confirmPassword"
                           disabled='true'
                           inputtype="password"
						   onChange={this.onChange}
						   value={this.state.confirmPassword}/>
				</Form.Field>

				</Form.Group>
				<br/>
				<Table.row>
					<Table.Cell> 
					<Button 
							onClick={this.edit}>Edit</Button>
        			</Table.Cell>
				</Table.row>
			</Form>

		);		
	}

}