import React from 'react'
import {Link} from 'react-router-dom';
import {List, Menu, Segment} from 'semantic-ui-react';

export default class SideNavbar extends React.Component {
    
	render() {
		let navbar = null

		if (this.props.isLogged) {
			if (this.props.user.isAdmin) {
				navbar = 
					<Segment id="nav" style={{left: "auto"}}>
						<Menu text vertical>
							<List>
								<List.Item><Link to="/cases">Cases</Link></List.Item>
								<List.Item><Link to="/newcase">Create a new Case</Link></List.Item>
								<hr style={{width:170, margin: "0px"}}/>
								<List.Item><Link to="/users">Users</Link></List.Item>
								<List.Item><Link to="/newuser">Create a new user</Link></List.Item>
							</List>
						</Menu>
					</Segment>
			} else {
				navbar = 
					<Segment id="nav" style={{left: "auto"}}>
						<Menu text vertical>
							<List>
								<List.Item><Link to="/caseList">Cases</Link></List.Item>
								<List.Item><Link to="/caseForm">Create a new Case</Link></List.Item>
							</List>
						</Menu>
					</Segment>
			}
		}

		return(navbar)
	}
}
