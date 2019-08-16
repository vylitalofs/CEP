import React from 'react';
import {Form, Button, Header, Grid} from 'semantic-ui-react';

export default class UserView extends React.Component {
		
	constructor(props) {
		super(props);
		this.state = {
			firstName:"",
			lastName:"",
			email:"",
			isAdmin:"false",
            password:"",
            confirmPassword:"",
            edit:false
		}
	}

	componentDidMount() {
		this.getUser();
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
					// convert to string for easier handling in form
					data.isAdmin = data.isAdmin ? "true" : "false"
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

	putUser = (user) => {
        let request = {
            method:"PUT",
            mode:"cors",
            headers:{"Content-Type":"application/json", token:this.props.token},
            body:JSON.stringify(user)
        }

        fetch("/api/user/" + this.props.id, request).then(response => {
            if (response.ok) {
                alert("Update successful!")
            }
            else {
                console.log("Server responded with status: " + response.status);
            }
        }).catch(error => {
        	console.log(error);
        })
    }
	
	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}

	onEdit = () => {
		let state = {};
		state.edit = true
		this.setState(state);
	}

	onCancel = () => {
		let state = {};
		state.edit = false
		this.setState(state);
	}
	
	onSubmit = (event) => {
		event.preventDefault();
		//Errors after accepting editing
		if(this.state.edit === true){
			if (this.state.firstName === "") {
				alert("First name required.");
				return;
			}

			if (this.state.lastName === "") {
				alert("Last name required.");
				return;
			}

			if ((this.state.email.length < 4 || this.state.password.length < 8)) {
				alert("Email must be atleast four characters and password eight characters long.");
				return;
			}

			if (this.state.confirmPassword !== this.state.password) {
				alert("Passwords don't match.");
				return;
			}
		}
		// Convert back to boolean
		let isAdmin = this.state.isAdmin === "true"

		let user = {
			firstName:this.state.firstName,
			lastName:this.state.lastName,
			email:this.state.email,
			isAdmin:isAdmin,
            password:this.state.password,
		}

		this.putUser(user)

		this.setState({
			firstName:"",
			lastName:"",
			email:"",
			isAdmin:"false",
            password:"",
            confirmPassword:"",
            edit:false
		})

		this.getUser();
	}

	render() {
		let edit = !this.state.edit ? {display:'none'} : {};
		return (
			<Form>

				<Header textAlign='center'>USER OVERVIEW</Header>

				<Form.Group widths='equal'>
					<Form.Field>
						<label htmlFor="firstName">First name:</label>
						<input type="text"
	                           name="firstName"
	                           disabled={!this.state.edit}
							   onChange={this.onChange}
							   value={this.state.firstName}/>
					</Form.Field>

					<Form.Field>
						<label htmlFor="lastName">Last name:</label>
						<input type="text"
	                           name="lastName"
	                           disabled={!this.state.edit}
	                           onChange={this.onChange}
							   value={this.state.lastName}/>
					</Form.Field>
				</Form.Group>

				<Form.Group widths='equal'>
					<Form.Field>
						<label htmlFor="email">Email:</label>
						<input type="text"
	                           name="email"
	                           disabled={!this.state.edit}
							   onChange={this.onChange}
							   value={this.state.email}/>
					</Form.Field>
				</Form.Group>

				<Form.Group>
					<Form.Field>
					<label htmlFor="isAdmin">Access Rights:</label>
					<select name="isAdmin"
							className="ui dropdown"
	                        onChange={this.onChange}
	                        disabled={!(this.state.edit || this.props.isAdmin)}
	                        inputtype="hidden" 
							value={this.state.isAdmin}
							>
							
							<option value="false">Basic user</option>				 		
	  				 		<option value="true">Admin</option>
	 				</select>
					</Form.Field>
				</Form.Group>

				<Form.Group grouped>
	                <Form.Field>
						<label htmlFor="password">Password:</label>
						<input type="password"
	                           name="password"
	                           disabled={!this.state.edit}
							   onChange={this.onChange}
							   value={this.state.password}/>
							   
					</Form.Field>
					
	                <Form.Field>
						<label htmlFor="confirmPassword">Confirm password:</label>
						<input type="password"
	                           name="confirmPassword"
	                           disabled={!this.state.edit}
							   onChange={this.onChange}
							   value={this.state.confirmPassword}/>
					</Form.Field>

				</Form.Group>

				<br/>
				<Grid>
					<Grid.Column textAlign="center">
						<Button onClick={this.onEdit} disabled={this.state.edit}>Edit</Button>
						<Button onClick={this.onCancel} style={edit}>Cancel</Button>
						<Button onClick={this.onSubmit} style={edit}>Submit</Button>
					</Grid.Column>
				</Grid>
			</Form>

		);		
	}


}