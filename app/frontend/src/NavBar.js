import React from 'react'
import {Link} from 'react-router-dom';
import {List, Menu} from 'semantic-ui-react';

export default class SideNavbar extends React.Component {
    
	render() {
		let navbar = <List></List>
		//if(this.props.isLogged) {
			navbar = <List>
					<List.Item><Link to="/caseList">Cases</Link></List.Item>
					<List.Item><Link to="/caseForm">Create a new Case</Link></List.Item>
                    <hr/>
					<List.Item><Link to="/userList">Users</Link></List.Item>
					<List.Item><Link to="/userForm">Create a new user</Link></List.Item>
				</List>
		//}
		return(
            <Menu text vertical>
				{navbar}
            </Menu>
		)
	}
}
