import React from 'react'
import {Link} from 'react-router-dom';
import {List, Menu, Segment, Icon} from 'semantic-ui-react';

export default function SideNav(props) {
	if (!props.isLogged) {
		return null;
	}

	return (
		<Segment id="nav" style={{left: "auto", minWidth: "200px", maxWidth: "200px", minHeight: "400px"}}>
			<br/>
			<Menu text vertical>
				<List>
					<List.Item>
						<Link to="/cases">
							<Icon name="folder outline"  size='large'/>
							&nbsp;Cases
						</Link>
					</List.Item>
					<List.Item>
						<Link to="/newcase">
							<Icon name="file alternate outline"  size='large'/>
							&nbsp;Create a new Case
						</Link>
					</List.Item>
				</List>
				<UserLinks user={props.user}/>
			</Menu>
		</Segment>
	);
}

function UserLinks(props) {
	if (props.user.accessLevel < 3) {
		return null;
	}

	return (
		<List>
			<br/>
			<List.Item>
				<Link to="/users">
					<Icon name="users" size='large'/>
					&nbsp; Users
				</Link>
			</List.Item>
			<List.Item>
				<Link to="/newuser">
					<Icon name="add user" size='large'/>
					&nbsp;Create a new user
				</Link>
			</List.Item>
		</List>
	);
}