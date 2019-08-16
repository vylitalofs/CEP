import React from 'react';
import {Form, Header, Button, Popup, Icon, Grid, GridRow} from 'semantic-ui-react';

export default class UserForm extends React.Component {
	
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

		let isAdmin = this.state.isAdmin === "true"

		let user = {
			firstName:this.state.firstName,
			lastName:this.state.lastName,
			email:this.state.email,
			isAdmin:isAdmin,
            password:this.state.password,
		}

		console.log(user)
		this.register(user)

		this.setState({
			firstName:"",
			lastName:"",
			email:"",
			isAdmin:"false",
            password:"",
            confirmPassword:""
		})
	}

	register = (user) => {
        let request = {
            method:"POST",
            mode:"cors",
            headers:{"Content-Type":"application/json", token:this.props.token},
            body:JSON.stringify(user)
        }

        fetch("/api/user/create", request).then(response => {
            if (response.ok) {
                alert("Register successful!")
            } else {
                console.log("Server responded with status: " + response.status);
            }
        }).catch(error => {

        })
    }
	
	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Header textAlign='center'>CREATE A NEW USER</Header>
				<Form.Group widths='equal'>
				<Form.Field>
					<label htmlFor="firstName">First name:</label>
					<input type="text"
						   name="firstName"
						   onChange={this.onChange}
						   value={this.state.firstName}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="lastName">Last name:</label>
					<input type="text"
						   name="lastName"
						   onChange={this.onChange}
						   value={this.state.lastName}/>

				</Form.Field>
				<Popup content='Insert firstName and lastName into the text field' 
							trigger={<Icon circular name='info' />} 
							position='bottom'/>
				</Form.Group>

				<Form.Group widths='equal'>
				<Form.Field>
					<label htmlFor="email">Email:</label>
					<input type="text"
						   name="email"
						   onChange={this.onChange}
						   value={this.state.email}/>
				</Form.Field>
				<Popup content='Insert a valid email address' 
							trigger={<Icon circular name='info' />} 
							position='bottom'/>
				</Form.Group>

				<Form.Group>
				<Form.Field>
				<label htmlFor="isAdmin">Access Rights:</label>
				<select name="isAdmin"
						class="ui dropdown"
						input type="hidden" 
						onChange={this.onChange}
						value={this.state.isAdmin}
						>
						
						<option value="false">Basic user</option>				 		
  				 		<option value="true">Admin</option>
 				</select>
				</Form.Field>
				<Popup content='Select users access rights' 
							trigger={<Icon circular name='info' />} 
							position='bottom'/>

				</Form.Group>
				<Grid>
					<Grid.Column floated= 'right' textAlign='right'>
				<Popup content='Password must be atleast 8 characters long.'
							trigger={<Icon circular name='info' 
							/>} position='bottom'  />
					</Grid.Column>
				</Grid>
				<Form.Group grouped>
                <Form.Field>
					<label htmlFor="password">Password:</label>
					<input type="text"
						   name="password"
						   onChange={this.onChange}
						   value={this.state.password}/>
						   
				</Form.Field>
				
                <Form.Field>
					<label htmlFor="confirmPassword">Confirm password:</label>
					<input type="text"
						   name="confirmPassword"
						   onChange={this.onChange}
						   value={this.state.confirmPassword}/>

				</Form.Field>
				</Form.Group>

				<Grid>
					<Grid.Column textAlign="center">
						<Button type="submit">Create</Button>
					</Grid.Column>
				</Grid>
			</Form>

		)		
	}

}