import React from 'react';
import {Table} from 'semantic-ui-react';
import UserRow from './UserRow';

export default class UserList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			removeIndex:-1,
			editIndex:-1,
			list:[],
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
					console.log(data)
					this.setState({
						list:data
					})
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
	

	render() {
		let listitems = this.state.list.map((user, index) => {
			return (
				<Table.Row>
					<Table.Cell>{this.props.user.firstName} {this.props.user.lastName}</Table.Cell>
					<Table.Cell>{this.props.user.email}</Table.Cell>
					<Table.Cell>{this.props.user.isAdmin}</Table.Cell>
				</Table.Row>		
			)	
		})	
	
	return(
		<Table celled>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderCell>Email</Table.HeaderCell>
					<Table.HeaderCell>Access rights</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{listitems}
			</Table.Body>
		</Table>
	)
	}
}