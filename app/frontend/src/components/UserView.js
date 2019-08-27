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
			edit:false,
			remove:false
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

	//EDIT
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

		// Validate input
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

		if (this.state.confirmPassword !== this.state.password) {
			alert("Passwords don't match.");
			return;
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

	//REMOVE
	onRemove = () => {
		let state = {};
		state.remove = true
		this.setState(state);
	}

	onCancelRemove = () => {
		let state = {};
		state.remove = false
		this.setState(state);
	}

	onSubmitRemove = () => {
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

	render() {
		let edit = !this.state.edit ? {display:'none'} : {};
		let noedit = this.state.edit ? {display:'none'} : {};
		let remove = !this.state.remove ? {display:'none'} : {};
		let noremove = (this.state.remove || !this.props.isAdmin) ? {display:'none'} : {};

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
		                        disabled={!(this.state.edit && this.props.isAdmin)}
		                        inputtype="hidden" 
								value={this.state.isAdmin}>
								
								<option value="false">Basic user</option>				 		
		  				 		<option value="true">Admin</option>
		 				</select>
					</Form.Field>
				</Form.Group>

				<Form.Group grouped style={edit}>
	                <Form.Field>
						<label htmlFor="password">Password:</label>
						<input type="password"
	                           name="password"
	                           disabled={!this.state.edit}
							   onChange={this.onChange}
							   value={this.state.password}/>
					</Form.Field>
					
	                <Form.Field style={edit}>
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
					<Grid.Column>
						<Button onClick={this.onEdit} disabled={this.state.remove} floated='left' style={noedit}>Edit</Button>
						<Button onClick={this.onCancel} floated='left' style={edit}>Cancel</Button>
						<Button onClick={this.onSubmit} floated='left' style={edit}>Submit</Button>		
						<Button onClick={this.onRemove} disabled={this.state.edit} floated='right' style={noremove}>Remove</Button>
						<Button onClick={this.onCancelRemove} floated='right' style={remove}>Cancel</Button>
						<Button onClick={this.onSubmitRemove} floated='right' style={remove}>Submit</Button>
					</Grid.Column>
				</Grid>
			</Form>

		);		
	}


}