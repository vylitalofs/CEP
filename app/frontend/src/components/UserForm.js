import React from 'react';
import {Form, Header, Button, Popup, Icon, Grid} from 'semantic-ui-react';

export default class UserForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			firstName:"",
			lastName:"",
			email:"",
			accessLevel:"1",
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

		if (this.state.accessLevel === "") {
			alert("AccessLevel required.");
			return;
		}

		if (this.state.password.length < 8) {
			alert("Password must be at least eight characters long.");
			return;
		}

		if (this.state.confirmPassword !== this.state.password) {
			alert("Passwords don't match");
			return;
		}

		let user = {
			firstName:this.state.firstName,
			lastName:this.state.lastName,
			email:this.state.email,
			accessLevel:this.state.accessLevel,
            password:this.state.password,
		}

		this.createUser(user)

		this.setState({
			firstName:"",
			lastName:"",
			email:"",
			accessLevel:"1",
            password:"",
            confirmPassword:""
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
            	alert("User creation failed.")
                console.log("Server responded with status: " + response.status);
            }
        }).catch(error => {
        	alert("User creation failed.")
			console.log(error);
        })
    }
	
	render() {
		return (
			<Form onSubmit={this.onSubmit} style={{padding:"10px"}}>
				<Header textAlign='center'>CREATE A NEW USER</Header>
				<Grid>
					<Grid.Column floated= 'right' textAlign='right' >
						<Popup content='Enter all the required information and press Create.' 
								trigger={<Icon circular name='info'/>} 
								position='bottom center'/>
					</Grid.Column>
				</Grid>

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
				</Form.Group>

				<Form.Group widths='equal'>
					<Form.Field>
						<label htmlFor="email">Email:</label>
						<input type="text"
								name="email"
								onChange={this.onChange}
								value={this.state.email}/>
					</Form.Field>
				</Form.Group>

				<Form.Group>
					<Form.Field>
						<label htmlFor="accessLevel">Access Rights:</label>
						<select name="accessLevel"
								className="ui dropdown"
								input type="hidden" 
								onChange={this.onChange}
								value={this.state.accessLevel}>
								
								<option value="0">Disabled</option>
								<option value="1">Basic user</option>
								<option value="2">Manager</option>
								<option value="3">Admin</option>
						</select>
					</Form.Field>
				</Form.Group>

				<Form.Group grouped>
					<Form.Field>
						<label htmlFor="password">Password:</label>
						<input type="password"
								name="password"
								onChange={this.onChange}
								value={this.state.password}/> 
					</Form.Field>
					
					<Form.Field>
						<label htmlFor="confirmPassword">Confirm password:</label>
						<input type="password"
								name="confirmPassword"
								onChange={this.onChange}
								value={this.state.confirmPassword}/>

					</Form.Field>
				</Form.Group>

				<Grid>
					<Grid.Column textAlign="center">
						<Button type="submit"><Icon name="plus"/>Create</Button>
					</Grid.Column>
				</Grid>
			</Form>

		)		
	}

}