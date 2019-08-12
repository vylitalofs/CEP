import React, { Component } from 'react';
import {Button, Menu} from 'semantic-ui-react';
import {Link} from 'react-router-dom';


export default class TopMenu extends Component {


  render() {
		//lisää elementit jos logattu sisään
		//if(this.props.isLogged) {
      let iconmenu = <Menu></Menu>
      
      
          iconmenu = <Menu secondary>
          <Menu.Item header position='left'>
            CEP ICON
          </Menu.Item>
          </Menu>

      let topmenu = <Menu></Menu>
      
      if (this.props.isLogged) {
      topmenu = <Menu secondary>
            <Menu.Item position='right'>
            <Menu.Item >Company</Menu.Item>
            <Menu.Item><Link to="/user">Name</Link></Menu.Item>

            <Menu.Item>
              <Button primary onClick={this.props.logout}>Log out</Button>
            </Menu.Item>
            </Menu.Item>
        </Menu>
      }
    return (
      <Menu>
        {iconmenu}
        <Menu.Menu position='right'>
          {topmenu}
        </Menu.Menu>
      </Menu>


      


    )
  }
}