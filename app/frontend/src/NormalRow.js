import React from 'react';
import {Table} from 'semantic-ui-react';

export default class NormalRow extends React.Component {


	render() {
		return (
			<Table.Row>
         //create a list of usernames, email and access rights
				<Table.Cell>{this.props.item.userName}</Table.Cell>
				<Table.Cell>{this.props.item.email}</Table.Cell>
				<Table.Cell>{this.props.item.isAdmin}</Table.Cell>
			</Table.Row>		
		)
		
	}
}