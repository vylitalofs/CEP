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

		if (user.email === "" || user.password === "") {
			alert("Credentials required.");
			return;
		}

		let request = {
            method:"POST",
            mode:"cors",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(user)
        }

		fetch("/login", request).then(response => {

            if (response.ok) {
                response.json().then(data => {
                	this.props.onLogin(data)
                	return
                }).catch(error => {
                    console.log("Error parsing JSON");
                	alert("Login failed.")
                })
            } 
            else {

            	if (response.status === 403) {
            		alert("User Account disabled.")
            		return
            	}

            	if (response.status === 422) {
            		alert("Incorrect credentials.")
            		return
            	}

                console.log("Server responded with status: "+response.status);
                alert("Login failed.")
            }

        }).catch(error => {
        	alert("Login failed.")
            console.log(error);
        })
	}

	render() {
		return (

			<Form onSubmit={this.onSubmit} style={{maxWidth:350, margin:'auto'}}>

				<Form.Field>
					<div className="ui left icon input">		
						<input type="text"
							name="email"
							placeholder="Email"
							required="required"
							maxLength="40"
							onChange={this.onChange}
							value={this.state.email}/>
						<i className="mail icon"></i>
					</div>
				</Form.Field>

				<Form.Field>
					<div className="ui left icon input">	
						<input type="password"
							name="password"
							placeholder="Password"
							required="required"
							maxLength="40"
							onChange={this.onChange}
							value={this.state.password}/>
						<i className="lock icon"></i>
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