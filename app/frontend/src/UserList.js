import React from 'react';
import {Table} from 'semantic-ui-react';
import NormalRow from './NormalRow';

export default class UserList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			removeIndex:-1,
			editIndex:-1
		}
	}
	

	render() {
		let listitems = this.props.list.map((item,index) => {
			return <NormalRow key={item.id}
					   item={item}/>		
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