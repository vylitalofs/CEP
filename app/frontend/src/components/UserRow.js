import React from 'react';
import {Table} from 'semantic-ui-react';

export default class UserRow extends React.Component {

	render() {
		return (
			<Table.Row>
				<Table.Cell>{this.props.user.firstName} {this.props.user.lastName}</Table.Cell>
				<Table.Cell>{this.props.user.email}</Table.Cell>
				<Table.Cell>{this.props.user.isAdmin}</Table.Cell>
			</Table.Row>		
		)
		
	}
}