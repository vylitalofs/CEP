import React from 'react';
import {Table} from 'semantic-ui-react';


export default class CaseList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			removeIndex:-1,
			editIndex:-1
		}
	}
	

	render() {	
	return(
		<Table celled>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Title</Table.HeaderCell>
					<Table.HeaderCell>Type</Table.HeaderCell>
					<Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>User</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
			</Table.Body>
		</Table>
	)
	}
}