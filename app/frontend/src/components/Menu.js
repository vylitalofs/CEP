import React, {Component} from 'react';
import {Button, Menu, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../CEPlogo.png';


export default class TopMenu extends Component {

	render() {

		let userlink = "/user/"+this.props.user._id
		let topmenu

		if (this.props.isLogged) {
			topmenu = <Menu secondary>
					<Menu.Item position='right'>
						<Menu.Item>
							<Icon name="building outline" size='large'/>FullStack Tampere Co
						</Menu.Item>

						<Menu.Item>
							<Icon name="user outline" size='large'/>Welcome &nbsp; <Link to={userlink}> {this.props.user.firstName} {this.props.user.lastName}</Link>!
						</Menu.Item>

						<Menu.Item>
							<Button primary onClick={this.props.logout}>Log out</Button>
						</Menu.Item>
					</Menu.Item>
			</Menu>
		}

		return (
			<Menu style={{marginTop: '10px'}}>
				<Menu secondary>
					<Menu.Item header position='left'>
						<img src={logo} alt="Logo" style={{width: 56, height: 50, marginLeft: 30}}/>
						&nbsp; &nbsp; &nbsp; Company Enhancement Platform
					</Menu.Item>
				</Menu>
				<Menu.Menu position='right'>
					{topmenu}
				</Menu.Menu>
			</Menu>
		)
	}
}