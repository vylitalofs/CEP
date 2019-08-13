import React from 'react';
import {Form,Button, Popup, Icon, Grid, GridRow} from 'semantic-ui-react';

export default class UserForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			firstname:"",
			surname:"",
			email:"",
			isAdmin:'0',
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
		let item = {
			firstname:this.state.firstname,
			surname:this.state.surname,
			email:this.state.email,
			isAdmin:this.state.isAdmin,
            password:this.state.password,
            confirmPassword:this.state.confirmPassword,
			id:0
		}

		//vikatapaukset
		if (item.firstname === "") {
			alert("Add Firstname");
			return;
		}
		if (item.Surname === "") {
			alert("Add Surname");
			return;
		}
		if (item.email.length < 4 || item.password.length < 8) {
			alert("Email must be atleast four characters and password eight characters long.");
			return;
		}
		if (item.confirmPassword !== item.password) {
			alert("Passwords don't match");
			return;
		}


		this.props.addToList(item);
		this.setState({
			firstname:"",
			surname:"",
			email:"",
			isAdmin:'0',
            password:"",
            confirmPassword:""
		})
	}
	
	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Header textAlign='center'>CREATE A NEW USER</Header>
				<Form.Group widths='equal'>
				<Form.Field>
					<label htmlFor="firstname">Firstname:</label>
					<input type="text"
						   name="firstname"
						   onChange={this.onChange}
						   value={this.state.firstname}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="surname">Surname:</label>
					<input type="text"
						   name="surname"
						   onChange={this.onChange}
						   value={this.state.surname}/>

				</Form.Field>
				<Popup content='Insert firstname and surname into the text field' 
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
						   value={this.state.isAdmin}>
						<i class="dropdown icon"></i>
						<option value='0'>Basic user</option>				 		
  				 		<option value='1'>Admin</option>
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
				<br/>
				<Button type="submit">Add</Button>
			</Form>

		)		
	}

}