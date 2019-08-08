import React from 'react';
import {Form,Button} from 'semantic-ui-react';

export default class UserForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			name:"",
			email:"",
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
			name:this.state.name,
			email:this.state.email,
            password:this.state.password,
            confirmPassword:this.state.confirmPassword,
			id:0
		}
		this.props.addToList(item);
		this.setState({
			name:"",
			email:"",
            password:"",
            confirmPassword:""
		})
	}
	
	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Field>
					<label htmlFor="name">Name:</label>
					<input type="text"
						   name="name"
						   onChange={this.onChange}
						   value={this.state.name}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="email">Email:</label>
					<input type="text"
						   name="email"
						   onChange={this.onChange}
						   value={this.state.email}/>
				</Form.Field>
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
				<Button type="submit">Add</Button>
			</Form>
		
		)		
	}

}