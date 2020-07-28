import React, {Component} from 'react';
import {Button, Menu, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../CEPlogo.png';

export default function TopBar(props) {
	return (
		<Menu style={{marginTop: '10px'}}>
			<CompanyIcon/>
			<UserMenu
				isLogged={props.isLogged}
				user={props.user}
				logout={props.logout}
				/>
		</Menu>
	);
}

function CompanyIcon() {
	return (
		<Menu secondary>
			<Menu.Item header position='left'>
				<img src={logo} alt="Logo" style={{width: 56, height: 50, marginLeft: 30}}/>
				&nbsp; &nbsp; &nbsp; Company Enhancement Platform
			</Menu.Item>
		</Menu>
	);
}

function UserIcon(props) {
	return (
		<Menu.Item>
			<Icon name="user outline" size='large'/>Welcome &nbsp;
			<Link to={"/user/"+props.user._id}>{props.user.firstName} {props.user.lastName}</Link>!
		</Menu.Item>
	);
}

function UserMenu(props) {
	if (!props.isLogged) {
		return null;
	}

	return (
		<Menu.Menu position='right'>
			<Menu secondary>
				<Menu.Item position='right'>
					<Menu.Item>
						<Icon name="building outline" size='large'/>FullStack Tampere Co
					</Menu.Item>

					<UserIcon user={props.user} />

					<Menu.Item>
						<Button primary onClick={props.logout}>Log out</Button>
					</Menu.Item>
				</Menu.Item>
			</Menu>
		</Menu.Menu>
	);
}