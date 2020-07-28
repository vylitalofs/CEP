import React from 'react';
import {Table, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default class UserList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			list:[]
		}
	}

	componentDidMount() {
		this.getUserList();
	}

	getUserList = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token}
		}

		fetch("/api/users", request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.setState({
						list:data
					});
				}).catch(error => {
					console.log("Error in parsing response json");
				});
			} else {
				console.log("Server responded with status: " + response.statusText);
			}
		}).catch(error => {
			console.log(error);
		});
	}

	render() {
		let userLevel = ["Disabled", "Basic User", "Manager", "Admin", "Super"];
	
		let listitems = this.state.list.map((user, index) => {
			let link = "/user/"+user._id;
			
			return (
				<Table.Row key={user._id}>
					<Table.Cell><Link to={link}>{user.firstName} {user.lastName}</Link></Table.Cell>
					<Table.Cell>{user.email}</Table.Cell>
					<Table.Cell>{userLevel[user.accessLevel]}</Table.Cell>
				</Table.Row>
			);
		});

		return (
			<div style={{padding:"10px"}}>
				<Header textAlign='center'>USERS</Header>
				<Table celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Email</Table.HeaderCell>
							<Table.HeaderCell>User Level</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{listitems}
					</Table.Body>
				</Table>
			</div>
		);
	}
}